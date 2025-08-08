import { AccountRiskLevel, Prisma, PrismaClient } from "@prisma/client";

export type UserRiskSignal = {
  key: string; // e.g. "SUSPICIOUS_EMAIL_DOMAIN"
  weight: number; // 1..100
  description: string;
};

export class FraudulentUserManager {
  private prisma: PrismaClient;

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma ?? new PrismaClient();
  }

  /**
   * Computes a numeric risk score for a user from collected signals,
   * stores it in `FraudUserRiskScore`, and returns the score and level.
   */
  async computeAndStoreRisk(userId: string): Promise<{ score: number; level: AccountRiskLevel }> {
    console.log(`[FraudUser] compute:start`, { userId });
    const signals = await this.collectSignals(userId);
    console.log(`[FraudUser] signals:collected`, {
      userId,
      count: signals.length,
      signals: signals.map((s) => ({ key: s.key, weight: s.weight })),
    });
    const score = Math.min(100, Math.max(0, signals.reduce((s, x) => s + x.weight, 0)));
    const level: AccountRiskLevel = score >= 80 ? "VERY_HIGH" : score >= 60 ? "HIGH" : score >= 35 ? "MEDIUM" : "LOW";

    const existing = await this.prisma.fraudUserRiskScore.findUnique({ where: { userId } });
    const reasons = signals.map((s) => ({ key: s.key, description: s.description, weight: s.weight }));
    if (existing) {
      await this.prisma.fraudUserRiskScore.update({
        where: { userId },
        data: { score, level, reasons: reasons as unknown as Prisma.InputJsonValue, updatedAt: new Date() },
      });
      console.log(`[FraudUser] risk:update`, { userId, score, level });
    } else {
      await this.prisma.fraudUserRiskScore.create({
        data: { userId, score, level, reasons: reasons as unknown as Prisma.InputJsonValue },
      });
      console.log(`[FraudUser] risk:create`, { userId, score, level });
    }

    return { score, level };
  }

  /**
   * Gather heuristic signals that indicate potential fraud risk for a user.
   * Each signal includes a key, a weight contribution, and a description.
   */
  async collectSignals(userId: string): Promise<UserRiskSignal[]> {
    console.log(`[FraudUser] collect:start`, { userId });
    const signals: UserRiskSignal[] = [];
    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { profile: true } });
    if (!user) {
      console.log(`[FraudUser] collect:no_user`, { userId });
      return signals;
    }

    // Signal: temporary email domain
    const tempDomains = ["mailinator.com", "yopmail.com", "tempmail.com"];
    const domain = user.email.split("@")[1]?.toLowerCase();
    if (domain && tempDomains.includes(domain)) {
      signals.push({ key: "SUSPICIOUS_EMAIL_DOMAIN", weight: 20, description: `Temporary email domain: ${domain}` });
      console.log(`[FraudUser] signal:add`, { key: "SUSPICIOUS_EMAIL_DOMAIN", domain });
    }

    // Signal: name mismatch with KYC profile
    if (user.profile) {
      const profileName = `${user.profile.firstName ?? ""} ${user.profile.lastName ?? ""}`.trim().toLowerCase();
      const emailNamePart = user.email.split("@")[0]?.replace(/\d+/g, "").replace(/[._-]/g, " ").trim().toLowerCase();
      if (profileName && emailNamePart && !emailNamePart.split(" ").some((p) => profileName.includes(p))) {
        signals.push({ key: "NAME_EMAIL_MISMATCH", weight: 10, description: "Email local part does not resemble KYC name" });
        console.log(`[FraudUser] signal:add`, { key: "NAME_EMAIL_MISMATCH" });
      }
    }

    // Signal: multiple failed or rejected transactions in last 7 days
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const failedCount = await this.prisma.transaction.count({
      where: { userId, createdAt: { gte: since }, status: { in: ["FAILED", "REJECTED", "DECLINE", "CANCELLED"] } },
    });
    console.log(`[FraudUser] collect:failed_tx_last_7d`, { userId, failedCount });
    if (failedCount >= 3) {
      signals.push({ key: "MANY_FAILS_LAST_7D", weight: Math.min(30, failedCount * 5), description: `${failedCount} failed/rejected in 7d` });
      console.log(`[FraudUser] signal:add`, { key: "MANY_FAILS_LAST_7D", failedCount });
    }

    // Signal: high-risk country
    const highRiskCountries = [
      "NG", "RU", "UA", "IR", "KP", "SY", "SD", "CU", "VE", "AF", "PK", "YE", "SO", "LY", "MM", "ZW", "CD", "CF", "SS"
    ];
    if (user.country && highRiskCountries.includes(user.country.toUpperCase())) {
      signals.push({
        key: "HIGH_RISK_COUNTRY",
        weight: 25,
        description: `User country is high risk: ${user.country}`
      });
      console.log(`[FraudUser] signal:add`, { key: "HIGH_RISK_COUNTRY", country: user.country });
    }

    // Signal: high country risk based on user.accountRiskLevel
    // if (user.accountRiskLevel === "HIGH" || user.accountRiskLevel === "VERY_HIGH") {
    //   signals.push({ key: "ACCOUNT_RISK_LEVEL_HIGH", weight: 25, description: `Account risk: ${user.accountRiskLevel}` });
    //   console.log(`[FraudUser] signal:add`, { key: "ACCOUNT_RISK_LEVEL_HIGH", accountRiskLevel: user.accountRiskLevel });
    // }

    console.log(`[FraudUser] collect:end`, { userId, count: signals.length });
    return signals;
  }
}

export default FraudulentUserManager;


