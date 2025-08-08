import { PrismaClient } from "@prisma/client";
import RuleManager from "./rule-manager";

const prisma = new PrismaClient();
const manager = new RuleManager(prisma);

async function main() {
  // Adjustable country list for RG-14.1
  const HIGH_RISK_COUNTRIES = ["IR", "KP", "SY", "CU", "RU", "AF", "MM", "BY"];

  const rules = [
    // RG-2.1 First Transaction ACH (BlindPay)
    {
      code: "RG-2.1",
      name: "First Transaction ACH (BlindPay) (Using Tags)",
      description: "Transaction amount is >= 200 in USD or equivalent",
      enabled: true,
      definition: {
        version: 1,
        when: {
          all: [
            { field: "type", op: "EQ", value: "USD_BANK_DEPOSIT" },
            { field: "tags", op: "CONTAINS", value: "FIRST_TRANSACTION" },
            { field: "amount", op: ">=", value: 200 },
          ],
        },
        then: { action: "SUSPEND", reason: "First ACH transaction >= 200" },
      },
      tags: ["ACH", "FIRST", "AMOUNT"],
    },

    // RG-2.2 First Transaction IBAN (Bridge) (Third party)
    {
      code: "RG-2.2",
      name: "First Transaction IBAN (Bridge) (Third party) (Using Tags)",
      description: "Transaction amount is >= 100 in EUR or equivalent.",
      enabled: true,
      definition: {
        version: 1,
        when: {
          all: [
            { field: "type", op: "EQ", value: "EUR_BANK_DEPOSIT" },
            { field: "tags", op: "CONTAINS", value: "FIRST_TRANSACTION" },
            { field: "tags", op: "CONTAINS", value: "THIRD_PARTY" },
            { field: "amount", op: ">=", value: 100 },
          ],
        },
        then: { action: "SUSPEND", reason: "First IBAN third-party transaction >= 100" },
      },
      tags: ["IBAN", "FIRST", "THIRD_PARTY", "AMOUNT"],
    },

    // RG-2.3 1000 USD max amount ACH (BlindPay)
    {
      code: "RG-2.3",
      name: "1000 USD max amount ACH (BlindPay) (Using Tags)",
      description: "Transaction amount is >= 1000 in USD or equivalent",
      enabled: true,
      definition: {
        version: 1,
        when: {
          all: [
            { field: "type", op: "EQ", value: "USD_BANK_DEPOSIT" },
            { field: "amount", op: ">=", value: 1000 },
          ],
        },
        then: { action: "SUSPEND", reason: "ACH amount >= 1000" },
      },
      tags: ["ACH", "AMOUNT"],
    },

    // RG-2.4 1000 EUR max amount IBAN - Third party - Natural
    {
      code: "RG-2.4",
      name: "1000 EUR max amount IBAN - Bridge - Third party - Natural",
      description: "Transaction amount is >= 1000 in EUR or equivalent not owner of account and is a natural person, not a company",
      enabled: true,
      definition: {
        version: 1,
        when: {
          all: [
            { field: "type", op: "EQ", value: "EUR_BANK_DEPOSIT" },
            { field: "tags", op: "CONTAINS", value: "THIRD_PARTY" },
            { field: "tags", op: "CONTAINS", value: "NATURAL_PERSON" },
            { field: "amount", op: ">=", value: 1000 },
          ],
        },
        then: { action: "SUSPEND", reason: "IBAN third-party natural person amount >= 1000" },
      },
      tags: ["IBAN", "THIRD_PARTY", "NATURAL_PERSON", "AMOUNT"],
    },

    // RG-2.5 First Transaction IBAN (Bridge) – Owner of account
    {
      code: "RG-2.5",
      name: "First Transaction IBAN (Bridge) (Using Tags)",
      description: "Transaction amount is >= 2000 in EUR or equivalent as owner of account.",
      enabled: true,
      definition: {
        version: 1,
        when: {
          all: [
            { field: "type", op: "EQ", value: "EUR_BANK_DEPOSIT" },
            { field: "tags", op: "CONTAINS", value: "FIRST_TRANSACTION" },
            { field: "tags", op: "CONTAINS", value: "OWNER_ACCOUNT" },
            { field: "amount", op: ">=", value: 2000 },
          ],
        },
        then: { action: "SUSPEND", reason: "First IBAN owner amount >= 2000" },
      },
      tags: ["IBAN", "FIRST", "OWNER_ACCOUNT", "AMOUNT"],
    },

    // RG-2.7 Transaction CRYPTO after ACH/IBAN
    {
      code: "RG-2.7",
      name: "Transaction CRYPTO after ACH/IBAN (Using Tags)",
      description: "If there is a CRYPTO transaction after an ACH/IBAN transaction then block",
      enabled: true,
      definition: {
        version: 1,
        when: {
          all: [
            { field: "type", op: "IN", value: ["BUY_CRYPTO", "WITHDRAW_FROM_DEFI", "DEPOSIT_TO_DEFI"] },
            { field: "tags", op: "CONTAINS", value: "AFTER_BANK" },
          ],
        },
        then: { action: "BLOCK", reason: "Crypto transaction after bank transaction" },
      },
      tags: ["CRYPTO", "BANK", "SEQUENCE"],
    },

    // RG-2.10 5000 EUR max amount IBAN - Third party - Company
    {
      code: "RG-2.10",
      name: "5000 EUR max amount IBAN - Bridge - Third party - Company",
      description: "Transaction amount is >= 5000 in EUR or equivalent not owner of account and is a company not a person",
      enabled: true,
      definition: {
        version: 1,
        when: {
          all: [
            { field: "type", op: "EQ", value: "EUR_BANK_DEPOSIT" },
            { field: "tags", op: "CONTAINS", value: "THIRD_PARTY" },
            { field: "tags", op: "CONTAINS", value: "COMPANY" },
            { field: "amount", op: ">=", value: 5000 },
          ],
        },
        then: { action: "SUSPEND", reason: "IBAN third-party company amount >= 5000" },
      },
      tags: ["IBAN", "THIRD_PARTY", "COMPANY", "AMOUNT"],
    },

    // RG-14.1 High risk country
    {
      code: "RG-14.1",
      name: "High risk country",
      description: "Transaction to or from a country that is designated as high risk. This rule uses a customizable list",
      enabled: true,
      definition: {
        version: 1,
        when: {
          all: [
            { field: "country", op: "IN", value: HIGH_RISK_COUNTRIES },
          ],
        },
        then: { action: "BLOCK", reason: "High risk country" },
      },
      tags: ["GEO", "HIGH_RISK"],
    },

    // RG-30.1 High velocity user 1/d IBAN (Bridge)
    {
      code: "RG-30.1",
      name: "High velocity user 1/d IBAN (Bridge) (Using Tags)",
      description: "If a user makes >= 3 transactions within a day",
      enabled: true,
      definition: {
        version: 1,
        when: {
          all: [
            { agg: "COUNT_TX", window: "1d", group_by: "userId", op: ">=", value: 3, where: { type: "EUR_BANK_DEPOSIT" } },
          ],
        },
        then: { action: "SUSPEND", reason: "Daily IBAN velocity >= 3" },
      },
      tags: ["VELOCITY", "IBAN"],
    },

    // RG-30.2 High velocity user 2/d ACH (BlindPay)
    {
      code: "RG-30.2",
      name: "High velocity user 2/d ACH (BlindPay) (Using Tags)",
      description: "If a user makes >= 2 transactions within a day",
      enabled: true,
      definition: {
        version: 1,
        when: {
          all: [
            { agg: "COUNT_TX", window: "1d", group_by: "userId", op: ">=", value: 2, where: { type: "USD_BANK_DEPOSIT" } },
          ],
        },
        then: { action: "SUSPEND", reason: "Daily ACH velocity >= 2" },
      },
      tags: ["VELOCITY", "ACH"],
    },

    // RG-30.3 High velocity user 6/w ACH (BlindPay)
    {
      code: "RG-30.3",
      name: "High velocity user 6/w ACH (BlindPay) (Using Tags)",
      description: "If a user makes >= 6 transactions within a week",
      enabled: true,
      definition: {
        version: 1,
        when: {
          all: [
            { agg: "COUNT_TX", window: "1w", group_by: "userId", op: ">=", value: 6, where: { type: "USD_BANK_DEPOSIT" } },
          ],
        },
        then: { action: "SUSPEND", reason: "Weekly ACH velocity >= 6" },
      },
      tags: ["VELOCITY", "ACH"],
    },

    // RG-30.4 High velocity user 4/w IBAN (Bridge)
    {
      code: "RG-30.4",
      name: "High velocity user 4/w IBAN (Bridge) (Using Tags)",
      description: "If a user makes >= 4 transactions within a week",
      enabled: true,
      definition: {
        version: 1,
        when: {
          all: [
            { agg: "COUNT_TX", window: "1w", group_by: "userId", op: ">=", value: 4, where: { type: "EUR_BANK_DEPOSIT" } },
          ],
        },
        then: { action: "SUSPEND", reason: "Weekly IBAN velocity >= 4" },
      },
      tags: ["VELOCITY", "IBAN"],
    },

    // RG-30.5 High velocity user 15min IBAN (Bridge)
    {
      code: "RG-30.5",
      name: "High velocity user 15min IBAN (Bridge) (Using Tags)",
      description: "If a user makes >= 2 transactions within 15 mins",
      enabled: true,
      definition: {
        version: 1,
        when: {
          all: [
            { agg: "COUNT_TX", window: "15m", group_by: "userId", op: ">=", value: 2, where: { type: "EUR_BANK_DEPOSIT" } },
          ],
        },
        then: { action: "SUSPEND", reason: "15m IBAN velocity >= 2" },
      },
      tags: ["VELOCITY", "IBAN"],
    },

    // RG-30.6 High velocity user 15min ACH (BlindPay)
    {
      code: "RG-30.6",
      name: "High velocity user 15min ACH (BlindPay) (Using Tags)",
      description: "If a user makes >= 2 transactions within 15 mins",
      enabled: true,
      definition: {
        version: 1,
        when: {
          all: [
            { agg: "COUNT_TX", window: "15m", group_by: "userId", op: ">=", value: 2, where: { type: "USD_BANK_DEPOSIT" } },
          ],
        },
        then: { action: "SUSPEND", reason: "15m ACH velocity >= 2" },
      },
      tags: ["VELOCITY", "ACH"],
    },

    // RG-31.1 2 repeated transactions within 15m
    {
      code: "RG-31.1",
      name: "2 number of repeated transactions within time period 15 min",
      description: "The rule detects if 2 repeated transactions occur within a specific time period of 15 min",
      enabled: true,
      definition: {
        version: 1,
        when: {
          all: [
            { agg: "COUNT_TX", window: "15m", group_by: "userId", op: ">=", value: 2 },
          ],
        },
        then: { action: "BLOCK", reason: "Repeated transactions within 15m" },
      },
      tags: ["REPETITION"],
    },
  ];

  for (const rule of rules) {
    const exists = await prisma.fraudRule.findUnique({ where: { code: rule.code } });
    if (!exists) {
      await manager.createRule(rule as any);
      console.log(`Created rule ${rule.code}`);
    } else {
      await manager.updateRule(rule.code, {
        name: (rule as any).name,
        description: (rule as any).description,
        enabled: (rule as any).enabled,
        definition: (rule as any).definition,
        tags: (rule as any).tags,
      } as any);
      console.log(`Updated rule ${rule.code}`);
    }
  }
}

/** Entry point: seeds initial image rules/velocity/crypto-after-bank rules. */
main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });


