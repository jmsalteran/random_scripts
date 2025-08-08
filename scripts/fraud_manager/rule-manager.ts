import { PrismaClient, Prisma } from "@prisma/client";

/**
 * Available operators to compare field or aggregate values during rule evaluation.
 */
export type ComparisonOperator = "EQ" | "NE" | ">" | ">=" | "<" | "<=" | "IN" | "NOT_IN" | "BETWEEN" | "CONTAINS";
/**
 * Supported aggregate metrics for historical analysis windows.
 */
export type Aggregator = "COUNT_TX" | "TOTAL_AMOUNT" | "AVG_AMOUNT" | "UNIQUE_COUNTERPARTIES";

/**
 * Simple field-based condition.
 */
export type FieldCondition = {
  field: string;
  op: ComparisonOperator;
  value: any;
};

/**
 * Aggregate window condition that groups by an identifier and applies an operator
 * over the computed metric (e.g., count transactions in 1d grouped by userId).
 */
export type AggregateCondition = {
  agg: Aggregator;
  window: string; // e.g. "15m", "1h", "1d", "1w", "1m"
  group_by: string; // e.g. "user_id"
  op: ComparisonOperator | ">" | ">=" | "<" | "<=" | "EQ" | "NE";
  value: number;
  // Optional filter fields scoped to event (e.g., tx_type)
  where?: { [key: string]: any };
};

/**
 * Logical combination of conditions. If `all` is provided, every condition must pass.
 * If `any` is provided, at least one condition must pass.
 */
export type RuleWhen = {
  all?: Array<FieldCondition | AggregateCondition>;
  any?: Array<FieldCondition | AggregateCondition>;
};

export type RuleThenAction = "ALLOW" | "REVIEW" | "BLOCK" | "FLAG" | "SUSPEND";

/**
 * Canonical rule definition stored as JSON.
 */
export type RuleDefinition = {
  version: number;
  when: RuleWhen;
  then: { action: RuleThenAction; reason: string };
};

/**
 * Input to create a new rule in the system.
 */
export type CreateRuleInput = {
  code: string; // Human friendly e.g. RG-30.1
  name: string;
  description?: string;
  enabled?: boolean;
  definition: RuleDefinition;
  tags?: string[];
};

/**
 * Manages CRUD operations and lifecycle for fraud rules including versioning snapshots.
 * Rules are never hard-deleted; use archive to deprecate.
 */
export class RuleManager {
  private prisma: PrismaClient;

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma ?? new PrismaClient();
  }

  /**
   * Creates a rule and a version snapshot entry.
   * - Automatically sets the version from the definition (defaults to 1).
   */
  async createRule(input: CreateRuleInput) {
    const now = new Date();
    const created = await this.prisma.fraudRule.create({
      data: {
        code: input.code,
        name: input.name,
        description: input.description ?? null,
        enabled: input.enabled ?? true,
        version: input.definition.version ?? 1,
        definition: input.definition as unknown as Prisma.InputJsonValue,
        tags: input.tags ?? [],
        createdAt: now,
      },
    });

    await this.prisma.fraudRuleVersion.create({
      data: {
        ruleId: created.id,
        version: created.version,
        description: created.description,
        definition: created.definition as Prisma.InputJsonValue,
      },
    });

    return created;
  }

  /**
   * Updates a rule and records a new version snapshot. The rule version is auto-incremented.
   * Pass a full `definition` to version the rule, or omit to keep the previous definition.
   */
  async updateRule(ruleIdOrCode: string, updates: Partial<Omit<CreateRuleInput, "code">> & { definition?: RuleDefinition }) {
    const rule = await this.getRuleByIdOrCode(ruleIdOrCode);
    if (!rule) throw new Error("Rule not found");

    const nextVersion = (rule.version ?? 0) + 1;
    const newDefinition = updates.definition
      ? { ...updates.definition, version: nextVersion }
      : undefined;

    const updated = await this.prisma.fraudRule.update({
      where: { id: rule.id },
      data: {
        name: updates.name ?? rule.name,
        description: updates.description ?? rule.description,
        enabled: updates.enabled ?? rule.enabled,
        version: nextVersion,
        definition: (newDefinition ?? (rule.definition as any)) as Prisma.InputJsonValue,
        tags: updates.tags ?? (rule.tags as string[]),
        updatedAt: new Date(),
      },
    });

    await this.prisma.fraudRuleVersion.create({
      data: {
        ruleId: updated.id,
        version: updated.version,
        description: updated.description,
        definition: updated.definition as Prisma.InputJsonValue,
      },
    });

    return updated;
  }

  /** Enables a rule by id or code. */
  async enableRule(ruleIdOrCode: string) {
    const rule = await this.getRuleByIdOrCode(ruleIdOrCode);
    if (!rule) throw new Error("Rule not found");
    return this.prisma.fraudRule.update({ where: { id: rule.id }, data: { enabled: true, updatedAt: new Date() } });
  }

  /** Disables a rule by id or code. */
  async disableRule(ruleIdOrCode: string) {
    const rule = await this.getRuleByIdOrCode(ruleIdOrCode);
    if (!rule) throw new Error("Rule not found");
    return this.prisma.fraudRule.update({ where: { id: rule.id }, data: { enabled: false, updatedAt: new Date() } });
  }

  /** Fetches a single rule by internal id or by `code`. */
  async getRuleByIdOrCode(idOrCode: string) {
    return this.prisma.fraudRule.findFirst({ where: { OR: [{ id: idOrCode }, { code: idOrCode }] } });
  }

  /** Lists rules with optional enabled filter, ordered by code. */
  async listRules(params?: { enabled?: boolean }) {
    return this.prisma.fraudRule.findMany({
      where: params?.enabled === undefined ? {} : { enabled: params.enabled },
      orderBy: [{ code: "asc" }],
    });
  }

  // Soft delete: never delete permanently
  /** Archives a rule, disabling it and marking `archived` with timestamp. */
  async archiveRule(ruleIdOrCode: string) {
    const rule = await this.getRuleByIdOrCode(ruleIdOrCode);
    if (!rule) throw new Error("Rule not found");
    return this.prisma.fraudRule.update({
      where: { id: rule.id },
      data: { archived: true, enabled: false, archivedAt: new Date(), updatedAt: new Date() },
    });
  }
}

export default RuleManager;


/*
BEGIN;

-- Clear fraud data in FK-safe order

-- Case-related (logs and hit rules) then cases
DELETE FROM fraud_case_action_logs;
DELETE FROM fraud_case_hit_rules;
DELETE FROM fraud_cases;

-- Event-related (hits can be cascaded by events, but delete explicitly for clarity)
DELETE FROM fraud_hits;
DELETE FROM fraud_events;

-- Rules (versions first)
DELETE FROM fraud_rule_versions;
DELETE FROM fraud_rules;

-- User risk scores
DELETE FROM fraud_user_risk_scores;

COMMIT;

*/