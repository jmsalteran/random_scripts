## Fraud & Compliance Manager

This module provides a rule-based fraud/compliance engine with event formatting, user risk scoring, case management, and rule lifecycle management.

### Contents
- Overview
- Data model
- Setup
- Seeding rules
- Processing a transaction
- Managing rules
- Working with cases
- Risk scoring
- Rule definition format

### Overview
- `event-generator.ts`: Builds a compact, in-memory event from a `Transaction`.
- `fraud-manager.ts`: Core engine. Evaluates rules on events, considers history and user risk, records hits, updates `Transaction`, and creates a case when action != `ALLOW`.
- `rule-manager.ts`: CRUD, versioning, enabling/disabling, archiving of rules (no hard delete).
- `case-manager.ts`: Operates fraud cases and their action logs & hit rules.
- `fraudulent-user-manager.ts`: Computes and stores a user risk score.

### Data model
New tables are snake_cased at the DB level via `@@map`/`@map`:
- `fraud_rules`, `fraud_rule_versions`, `fraud_events`, `fraud_hits`, `fraud_cases`, `fraud_case_hit_rules`, `fraud_case_action_logs`, `fraud_user_risk_scores`.
All data is retained (rules are archived; no destructive deletes).

### Setup
1) Configure database URL in `.env` (`DATABASE_URL=...`).
2) Generate client and apply schema:
```powershell
npx prisma format
npx prisma generate
# Use one of the following:
npx prisma db push
# or if you want a migration:
npx prisma migrate dev --name fraud_manager_init
```

### Seeding rules
Seed initial example rules (velocity, first-transaction-amount, crypto-after-bank):
```powershell
npx ts-node scripts/fraud_manager/seed-fraud-rules.ts
```

### Processing a transaction
Evaluate a transaction by id through the fraud engine:
```ts
import FraudManager from "./scripts/fraud_manager/fraud-manager";

const manager = new FraudManager();
const { action, evaluations } = await manager.onTransaction("<transaction-id>");
// action: 'ALLOW' | 'REVIEW' | 'FLAG' | 'SUSPEND' | 'BLOCK'
```
Side effects:
- Creates a `fraud_events` row with the event payload.
- Adds `fraud_hits` for triggered rules.
- Updates `Transaction.complianceCheckingStatus`, `subStatus = 'COMPLIANCE_CHECK'`, plus JSON arrays in `complianceExecutedRules` and `complianceHitRules`.
- Creates a `fraud_cases` record when `action !== 'ALLOW'` and a first action log.

### Managing rules
Create, update (auto-version), enable/disable, list, archive:
```ts
import RuleManager from "./scripts/fraud_manager/rule-manager";

const rules = new RuleManager();

// Create
await rules.createRule({
  code: "RG-99.1",
  name: "Daily velocity",
  definition: {
    version: 1,
    when: { all: [{ agg: "COUNT_TX", window: "1d", group_by: "userId", op: ">", value: 10 }] },
    then: { action: "BLOCK", reason: "Daily velocity limit exceeded" },
  },
  tags: ["VELOCITY"],
});

// Update (auto-increments version and snapshots)
await rules.updateRule("RG-99.1", {
  description: "Block if > 8 tx per day",
  definition: {
    version: 1, // will be replaced with next version automatically
    when: { all: [{ agg: "COUNT_TX", window: "1d", group_by: "userId", op: ">", value: 8 }] },
    then: { action: "BLOCK", reason: "Velocity > 8/day" },
  },
});

// Enable/disable
await rules.enableRule("RG-99.1");
await rules.disableRule("RG-99.1");

// Archive (soft delete)
await rules.archiveRule("RG-99.1");
```

### Working with cases
Fetch, resolve, and log actions in a case:
```ts
import CaseManager from "./scripts/fraud_manager/case-manager";

const cases = new CaseManager();
const theCase = await cases.getCase("<case-id>");

await cases.addActionLog(theCase!.id, "REVIEW", "Requested additional documents", "<system-user-id>");
await cases.setStatus(theCase!.id, "UNDER_REVIEW");
await cases.resolveCase(theCase!.id, { action: "ALLOW", reason: "Documents verified" });
```

### Risk scoring
Update a user’s risk score:
```ts
import FraudulentUserManager from "./scripts/fraud_manager/fraudulent-user-manager";

const fum = new FraudulentUserManager();
const result = await fum.computeAndStoreRisk("<user-id>");
// result: { score: number, level: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH' }
```

### Rule definition format
Rules are JSON definitions stored in `fraud_rules.definition` and versioned in `fraud_rule_versions`.
Supported condition nodes:
- Field conditions: `{ field, op, value }` where `op` ∈ `EQ | NE | > | >= | < | <= | IN | NOT_IN | BETWEEN | CONTAINS`.
- Aggregate conditions: `{ agg, window, group_by, op, value, where? }` where `agg` ∈ `COUNT_TX | TOTAL_AMOUNT | AVG_AMOUNT | UNIQUE_COUNTERPARTIES`.
Logical shape:
```json
{
  "version": 1,
  "when": {
    "all": [
      { "field": "tx_type", "op": "IN", "value": ["TRANSFER_OUT", "P2P"] },
      { "field": "country", "op": "IN", "value": ["CO", "MX"] },
      { "agg": "COUNT_TX", "window": "1d", "group_by": "userId", "op": ">", "value": 10 }
    ]
  },
  "then": { "action": "BLOCK", "reason": "Daily velocity limit exceeded" }
}
```

### Notes
- This engine never deletes data; rules are archived and all events/cases/hits are retained.
- New tables/columns are snake_cased at DB level via `@@map`/`@map`.
- After schema changes, always `npx prisma generate` and recompile TypeScript.


