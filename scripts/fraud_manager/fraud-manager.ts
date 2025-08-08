import { Prisma, PrismaClient, ComplianceCheckingStatus } from "@prisma/client";
import { EventGenerator, FraudEventPayload } from "./event-generator";
import { AggregateCondition, FieldCondition, RuleDefinition, RuleThenAction } from "./rule-manager";
import FraudulentUserManager from "./fraudulent-user-manager";
import CaseManager from "./case-manager";

type EvaluationResult = {
  rule: any;
  action: RuleThenAction;
  reason: string;
};

export class FraudManager {
  private prisma: PrismaClient;
  private eventGenerator: EventGenerator;
  private fraudulentUserManager: FraudulentUserManager;
  private caseManager: CaseManager;

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma ?? new PrismaClient();
    this.eventGenerator = new EventGenerator(this.prisma);
    this.fraudulentUserManager = new FraudulentUserManager(this.prisma);
    this.caseManager = new CaseManager(this.prisma);
  }

  /**
   * Processes a transaction id through the compliance engine:
   * 1) builds an event, 2) evaluates rules, 3) incorporates history & user risk,
   * 4) records hits and updates the transaction, and 5) creates a case when needed.
   */
  async onTransaction(transactionId: string) {
    console.log(`[FraudManager] onTransaction:start`, { transactionId });
    const event = await this.eventGenerator.generateFromTransactionId(transactionId);
    console.log(`[FraudManager] event:generated`, {
      userId: event.userId,
      tx_type: (event as any).tx_type,
      amount: (event as any).amount,
      tags: (event as any).tags,
    });
    const userRisk = await this.fraudulentUserManager.computeAndStoreRisk(event.userId);
    (event as any).user_risk_level = userRisk.level;
    (event as any).user_risk_score = userRisk.score;
    console.log(`[FraudManager] user:risk`, userRisk);

    const prismaEvent = await (this.prisma as any).fraudEvent.create({ data: { transactionId, userId: event.userId, payload: event as unknown as Prisma.InputJsonValue } });
    console.log(`[FraudManager] event:persisted`, { eventId: prismaEvent.id });

    const rules = await (this.prisma as any).fraudRule.findMany({ where: { enabled: true, archived: false } });
    console.log(`[FraudManager] rules:loaded`, { count: rules.length });
    const evaluations: EvaluationResult[] = [];
    for (const rule of rules) {
      const definition = rule.definition as unknown as RuleDefinition;
      const ok = await this.evaluate(definition, event);
      console.log(`[FraudManager] rule:evaluated`, { code: rule.code, ok });
      if (ok) {
        evaluations.push({ rule, action: definition.then.action, reason: definition.then.reason });
        console.log(`[FraudManager] rule:HIT`, { code: rule.code, action: definition.then.action, reason: definition.then.reason });
      }
    }

    // Determine most severe action
    const action = this.mergeActions(evaluations.map((e) => e.action));
    console.log(`[FraudManager] action:initial`, { action });

    // Historical compliance signals
    const historical = await this.prisma.transaction.count({ where: { userId: event.userId, complianceCheckingStatus: { in: ["BLOCK", "FLAG", "SUSPEND"] } } });
    console.log(`[FraudManager] historical:negative_hits`, { count: historical });
    if (historical >= 1) {
      // escalate at least to REVIEW
      if (this.rank(action) < this.rank("REVIEW")) {
        evaluations.push({ rule: rules[0]!, action: "REVIEW", reason: "Historical negative compliance hits" });
        console.log(`[FraudManager] action:escalated`, { reason: "historical", to: "REVIEW" });
      }
    }

    // User risk score adjustment (already computed above)
    const level = (event as any).user_risk_level as string | undefined;
    if (level === "HIGH" || level === "VERY_HIGH") {
      if (this.rank(action) < this.rank("REVIEW")) {
        evaluations.push({ rule: rules[0]!, action: "REVIEW", reason: `User risk level ${level}` });
        console.log(`[FraudManager] action:escalated`, { reason: "user_risk", level, to: "REVIEW" });
      }
    }

    const finalAction = this.mergeActions(evaluations.map((e) => e.action));
    console.log(`[FraudManager] action:final`, {
      action: finalAction,
      hits: evaluations.map((e) => ({ code: e.rule.code, action: e.action })),
    });

    // Record hits
    for (const ev of evaluations) {
      await (this.prisma as any).fraudHit.create({ data: { eventId: prismaEvent.id, ruleId: ev.rule.id, action: ev.action as any, reason: ev.reason } });
    }
    if (evaluations.length > 0) {
      console.log(`[FraudManager] hits:recorded`, { count: evaluations.length });
    }

    // Update transaction with compliance result
    const status: ComplianceCheckingStatus = finalAction as unknown as ComplianceCheckingStatus;
    const executedRulesArray = evaluations.map((e) => ({ code: e.rule.code, action: e.action })) as unknown as Prisma.InputJsonValue[];
    const hitRulesArray = evaluations.map((e) => ({ code: e.rule.code, reason: e.reason })) as unknown as Prisma.InputJsonValue[];
    await this.prisma.transaction.update({ where: { id: transactionId }, data: { complianceCheckingStatus: status, subStatus: "COMPLIANCE_CHECK", complianceExecutedRules: executedRulesArray, complianceHitRules: hitRulesArray } });
    console.log(`[FraudManager] transaction:updated`, { transactionId, status: finalAction });

    // If not ALLOW -> create a case
    if (finalAction !== "ALLOW") {
      await this.caseManager.createCase({
        eventId: prismaEvent.id,
        transactionId,
        userId: event.userId,
        initialAction: finalAction as any,
        hitRules: evaluations.map((e) => ({ ruleId: e.rule.id, code: e.rule.code, name: e.rule.name, action: e.action as any, reason: e.reason })),
        payload: prismaEvent.payload,
      });
      console.log(`[FraudManager] case:created`, { eventId: prismaEvent.id, transactionId, action: finalAction });
    }

    const result = { action: finalAction, evaluations };
    console.log(`[FraudManager] onTransaction:end`, result);
    return result;
  }

  private rank(action: RuleThenAction): number {
    switch (action) {
      case "BLOCK":
        return 5;
      case "SUSPEND":
        return 4;
      case "FLAG":
        return 3;
      case "REVIEW":
        return 2;
      default:
        return 1;
    }
  }

  private mergeActions(actions: RuleThenAction[]): RuleThenAction {
    let rank = 0;
    let current: RuleThenAction = "ALLOW";
    for (const a of actions) {
      const r = this.rank(a);
      if (r > rank) {
        rank = r;
        current = a;
      }
    }
    return current;
  }

  /** Evaluates a full rule definition against an event payload. */
  private async evaluate(definition: RuleDefinition, event: FraudEventPayload): Promise<boolean> {
    const { when } = definition;
    const evalCond = async (cond: FieldCondition | AggregateCondition): Promise<boolean> => {
      if ((cond as any).field) {
        return this.evaluateFieldCondition(cond as FieldCondition, event);
      }
      return this.evaluateAggregateCondition(cond as AggregateCondition, event);
    };

    if (when.all && when.all.length > 0) {
      for (const c of when.all) {
        if (!(await evalCond(c))) return false;
      }
      return true;
    }
    if (when.any && when.any.length > 0) {
      for (const c of when.any) {
        if (await evalCond(c)) return true;
      }
      return false;
    }
    return false;
  }

  /** Evaluates a simple field condition against event fields. */
  private evaluateFieldCondition(cond: FieldCondition, event: FraudEventPayload): boolean {
    const left = (event as any)[cond.field];
    const right = cond.value;
    switch (cond.op) {
      case "EQ":
        return left === right;
      case "NE":
        return left !== right;
      case ">":
        return Number(left) > Number(right);
      case ">=":
        return Number(left) >= Number(right);
      case "<":
        return Number(left) < Number(right);
      case "<=":
        return Number(left) <= Number(right);
      case "IN":
        return Array.isArray(right) && right.includes(left);
      case "NOT_IN":
        return Array.isArray(right) && !right.includes(left);
      case "BETWEEN":
        return Array.isArray(right) && Number(left) >= Number(right[0]) && Number(left) <= Number(right[1]);
      case "CONTAINS":
        return Array.isArray(left) && left.includes(right);
      default:
        return false;
    }
  }

  /** Parses a window string like 15m, 1h, 1d into a JavaScript Date boundary. */
  private parseWindowToDate(window: string): Date {
    const m = window.match(/^(\d+)([mhdw])$/);
    if (!m) return new Date(0);
    const n = Number(m[1]);
    const unit = m[2];
    const now = Date.now();
    const mult = unit === "m" ? 60 * 1000 : unit === "h" ? 60 * 60 * 1000 : unit === "d" ? 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
    return new Date(now - n * mult);
  }

  /**
   * Executes an aggregate condition by querying historical transactions within
   * a window and comparing the aggregated metric against the threshold.
   */
  private async evaluateAggregateCondition(cond: AggregateCondition, event: FraudEventPayload): Promise<boolean> {
    const since = this.parseWindowToDate(cond.window);
    const whereBase: Prisma.TransactionWhereInput = { createdAt: { gte: since } };
    const groupValue = (event as any)[cond.group_by];

    const where: Prisma.TransactionWhereInput = { ...whereBase };
    if (cond.group_by === "user_id" || cond.group_by === "userId") where.userId = groupValue;
    if (cond.group_by === "to_user_id" || cond.group_by === "toUserId") (where as any).toUserId = groupValue;

    if (cond.where) {
      // basic mapping (e.g., { tx_type: "PAYMENT" })
      if (cond.where.tx_type) (where as any).type = cond.where.tx_type;
    }

    let metric = 0;
    if (cond.agg === "COUNT_TX") {
      metric = await this.prisma.transaction.count({ where });
    } else if (cond.agg === "TOTAL_AMOUNT") {
      const rows = await this.prisma.transaction.findMany({ where, select: { amount: true } });
      metric = rows.reduce((s, r) => s + Number(r.amount), 0);
    } else if (cond.agg === "AVG_AMOUNT") {
      const rows = await this.prisma.transaction.findMany({ where, select: { amount: true } });
      metric = rows.length ? rows.reduce((s, r) => s + Number(r.amount), 0) / rows.length : 0;
    } else if (cond.agg === "UNIQUE_COUNTERPARTIES") {
      const rows = await this.prisma.transaction.findMany({ where, select: { toUserId: true, toExternalId: true } });
      const set = new Set(rows.map((r) => r.toUserId ?? r.toExternalId ?? ""));
      set.delete("");
      metric = set.size;
    }

    switch (cond.op) {
      case ">":
        return metric > Number(cond.value);
      case ">=":
        return metric >= Number(cond.value);
      case "<":
        return metric < Number(cond.value);
      case "<=":
        return metric <= Number(cond.value);
      case "EQ":
        return metric === Number(cond.value);
      case "NE":
        return metric !== Number(cond.value);
      default:
        return false;
    }
  }
}

export default FraudManager;


