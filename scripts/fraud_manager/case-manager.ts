import { PrismaClient, FraudCaseStatus, FraudAction, Prisma } from "@prisma/client";

export class CaseManager {
  private prisma: PrismaClient;

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma ?? new PrismaClient();
  }

  /**
   * Creates a fraud case for an event/transaction, stores the hit rules, and
   * adds an initial action log with the chosen action.
   */
  async createCase(params: {
    eventId: string;
    transactionId: string;
    userId: string;
    initialAction: FraudAction;
    hitRules: Array<{ ruleId: string; code: string; name: string; action: FraudAction; reason: string }>;
    payload: Prisma.InputJsonValue;
  }) {
    const created = await this.prisma.fraudCase.create({
      data: {
        eventId: params.eventId,
        transactionId: params.transactionId,
        userId: params.userId,
        status: "OPEN",
        currentAction: params.initialAction,
        payload: params.payload,
      },
    });

    for (const hr of params.hitRules) {
      await this.prisma.fraudCaseHitRule.create({
        data: { caseId: created.id, ruleId: hr.ruleId, ruleCode: hr.code, ruleName: hr.name, action: hr.action, reason: hr.reason },
      });
    }

    await this.addActionLog(created.id, params.initialAction, `Case created with ${params.hitRules.length} hit rule(s)`);
    return created;
  }

  /** Adds an action log entry to an existing case. */
  async addActionLog(caseId: string, action: FraudAction, note?: string, systemUserId?: string) {
    return this.prisma.fraudCaseActionLog.create({
      data: { caseId, action, note: note ?? null, systemUserId: systemUserId ?? null },
    });
  }

  /** Sets the current status of the case (e.g., UNDER_REVIEW). */
  async setStatus(caseId: string, status: FraudCaseStatus) {
    return this.prisma.fraudCase.update({ where: { id: caseId }, data: { status, updatedAt: new Date() } });
  }

  /** Resolves a case with a final action and optional reason, closing it. */
  async resolveCase(caseId: string, resolution: { action: FraudAction; reason?: string; systemUserId?: string }) {
    const updated = await this.prisma.fraudCase.update({
      where: { id: caseId },
      data: { status: "RESOLVED", resolutionAction: resolution.action, resolutionReason: resolution.reason ?? null, closedAt: new Date(), updatedAt: new Date() },
    });
    await this.addActionLog(caseId, resolution.action, resolution.reason, resolution.systemUserId);
    return updated;
  }

  /** Fetches a case including timeline action logs and hit rules. */
  async getCase(caseId: string) {
    return this.prisma.fraudCase.findUnique({
      where: { id: caseId },
      include: { actionLogs: true, hitRules: true },
    });
  }
}

export default CaseManager;


