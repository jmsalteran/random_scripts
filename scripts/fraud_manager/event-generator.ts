import { PrismaClient, Transaction } from "@prisma/client";

export type FraudEventPayload = {
  eventId?: string;
  transactionId: string;
  userId: string;
  toUserId?: string | null;
  tx_type: string; // mirrors TransactionType
  amount: string; // Decimal as string
  currency?: string | null;
  country?: string | null;
  payment_method?: string | null;
  created_at: string; // ISO string
  ip_address?: string | null;
  tags: string[];
  // Optional user risk annotations
  user_risk_level?: string;
  user_risk_score?: number;
  // anything else useful, compacted
};

const TEMP_EMAIL_DOMAINS = [
  "mailinator.com",
  "guerrillamail.com",
  "tempmail.com",
  "10minutemail.com",
  "yopmail.com",
];

export class EventGenerator {
  private prisma: PrismaClient;

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma ?? new PrismaClient();
  }

  /**
   * Build a compact event payload from a Transaction id. Throws if not found.
   */
  async generateFromTransactionId(transactionId: string): Promise<FraudEventPayload> {
    const tx = await this.prisma.transaction.findUnique({ where: { id: transactionId } });
    if (!tx) throw new Error("Transaction not found");

    return this.generateFromTransaction(tx);
  }

  /**
   * Build a compact event payload from a Transaction entity, enriching with basic tags.
   */
  async generateFromTransaction(tx: Transaction): Promise<FraudEventPayload> {
    const user = await this.prisma.user.findUnique({ where: { id: tx.userId } });
    const toUser = tx.toUserId ? await this.prisma.user.findUnique({ where: { id: tx.toUserId } }) : null;

    const tags: string[] = [];
    if (await this.isFirstTransaction(tx.userId, tx.id)) tags.push("FIRST_TRANSACTION");
    if (user?.country) tags.push(`COUNTRY_${user.country}`);
    if (user?.email && this.isTempEmail(user.email)) tags.push("TEMP_EMAIL_DOMAIN");
    if (toUser?.id) tags.push("HAS_COUNTERPARTY_USER");

    // Owner vs third-party account tags for IBAN flows
    if (tx.type === "EUR_BANK_DEPOSIT") {
      if (tx.toUserId && tx.toUserId === tx.userId) tags.push("OWNER_ACCOUNT");
      if (!tx.toUserId || tx.toUserId !== tx.userId) tags.push("THIRD_PARTY");
    }

    // Natural person vs company
    if (user?.isBusiness === false) tags.push("NATURAL_PERSON");
    if (user?.isBusiness === true) tags.push("COMPANY");

    // Sequence tag for crypto after bank detection can be added by downstream processors.

    const payload: FraudEventPayload = {
      transactionId: tx.id,
      userId: tx.userId,
      toUserId: tx.toUserId,
      tx_type: tx.type,
      amount: tx.amount.toString(),
      currency: tx.currency ?? tx.finalCurrency ?? null,
      country: user?.country ?? null,
      payment_method: tx.paymentMethod ?? null,
      created_at: tx.createdAt.toISOString(),
      ip_address: tx.ipAddress ?? null,
      tags,
    };

    return payload;
  }

  /** Returns whether it is the user's first transaction (including current). */
  private async isFirstTransaction(userId: string, processingTxId: string): Promise<boolean> {
    const count = await this.prisma.transaction.count({ where: { userId, id: { not: processingTxId } } });
    console.log(`[EventGenerator] isFirstTransaction`, { count });
    return count <= 1; // consider current one
  }

  /** Rudimentary temp-email check based on domain list. */
  private isTempEmail(email: string): boolean {
    const domain = email.split("@")[1]?.toLowerCase();
    return TEMP_EMAIL_DOMAINS.includes(domain);
  }
}

export default EventGenerator;


