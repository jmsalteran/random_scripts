---
name: creating-temporal-workflows
description: Creates complete Temporal workflow implementations for this monorepo. Generates workflow, activities, worker, and client; exports from packages/temporal/index.ts; registers the worker in packages/api3/app.ts so the task queue is polled (otherwise workflows stay scheduled). Use when the user asks to create a new Temporal workflow, add a new background process, or build a new long-running distributed task.
---

# Creating Temporal Workflows

Every workflow in this repo requires **4 source files** plus **wiring in the temporal package and api3**:

```
packages/temporal/src/
├── workflows/<name>.workflow.ts        # Orchestration logic
├── activities/<name>/
│   ├── index.ts                        # Re-exports all activities
│   └── <activity-name>.activity.ts    # One file per activity
├── workers/<name>.worker.ts            # Registers workflow + activities
└── clients/<name>.client.ts           # Starts the workflow

packages/temporal/index.ts              # Export worker + client (and types as needed)
packages/api3/app.ts                    # Start the worker process (non-development)
```

The `<name>` is always `kebab-case` (e.g. `refill-avenia-balance`).

---

## Multiple activities (mandatory)

**Every new workflow MUST invoke at least two distinct activities** from the workflow function (sequential steps, `Promise.all`, or loops over activity calls). This is not optional.

**Additionally, every workflow MUST finish by invoking a dedicated final-status activity** that reports the final outcome (`SUCCESS`, `FAILED`, `TIMEOUT`, etc.) with contextual detail. This is mandatory for observability and post-mortem analysis.

- **Do not** ship a workflow that only calls a single “do everything” activity wrapping one `Service.run()` (or equivalent). Split work by **phase**, **external system**, or **bounded responsibility** (e.g. fetch NEAR vs fetch Relay vs notify; load vs transform vs persist).
- If a service already exposes one big `run()` method, **refactor the service** into phase methods (or separate services) and give **each phase its own activity file**, then orchestrate from the workflow.
- Small final steps (e.g. Slack notification, metrics flush) still count as separate activities when they perform I/O — prefer a dedicated activity over folding them into the last “big” activity.
- The final-status activity must run on **all terminal paths** (success, business failure, timeout, unexpected error), typically via a `reportOnce(...)` helper in the workflow.

Rationale: separate activities get independent timeouts, retries, and visibility in Temporal history; a single long activity hides progress and couples unrelated failures.

---

## Step-by-step process

1. **Understand the use case** – identify inputs, **decompose into multiple activities** (minimum two), signals (if any), and failure scenarios.
2. **Create the activities** – one file per activity function, grouped in `activities/<name>/`, with an `index.ts` re-exporting all of them. Never one mega-activity for the whole job.
3. **Create the workflow** – orchestration only; no direct DB/API calls; **call each activity at least once** (or in a loop), never a single wrapper activity only.
   - Ensure a dedicated `report-final-status` activity is called before returning/throwing in terminal branches.
4. **Create the worker** – uses `WorkerFactory`, always mirrors the exact task queue name used in the client.
5. **Create the client** – `static async startWorkflow(...)` class method.
6. **Export from `packages/temporal/index.ts`** – import the new worker (and client if public), add both to the `export { ... }` block so `@meru/temporal` consumers can use them.
7. **Register the worker in `packages/api3/app.ts`** – see [Registering the worker in api3](#registering-the-worker-in-api3-mandatory) below. Without this, `client.start()` will schedule workflows that **never execute**: Temporal will show “Workflow Task Scheduled” on your task queue, while other workers in the cluster (other queues) look “healthy” but do not pick up your tasks.

See [TEMPLATES.md](TEMPLATES.md) for copy-paste file templates.

---

## Registering the worker in api3 (mandatory)

**Mental model:** `WorkflowClient.start()` only **creates** a workflow execution on Temporal and assigns it to a **task queue**. Nothing runs until some **worker process** polls that **exact** queue name. The file `workers/<name>.worker.ts` does not run by itself; something must call `Temporal<Name>Worker.run()`.

In this monorepo, **api3** starts all Temporal workers together when `envFromRealEnvironment !== "development"` (inside `app.listen`, after the server binds). Each entry runs `worker.run()` in parallel (long-lived polls).

**Do this for every new workflow worker:**

1. **Import** the class from `@meru/temporal` next to the other `Temporal*Worker` imports in `packages/api3/app.ts`:

   ```typescript
   import {
     // ...existing workers
     Temporal<YourName>Worker,
   } from "@meru/temporal";
   ```

2. **Append** an object to the `workers` array in the same file (same shape as siblings):

   ```typescript
   {
     name: "Temporal<YourName>Worker",
     worker: Temporal<YourName>Worker,
   },
   ```

**Development:** In `development`, that whole `workers` block is skipped, so **no** workers start with api3. For local testing you must run a worker yourself (e.g. a small script that calls `Temporal<YourName>Worker.run()`) or point at an environment where api3 starts workers.

**Debugging “no worker”:** If Temporal Web shows workers but your workflow stays on “Workflow Task Scheduled”, open the event and check **Task Queue Name**. Those listed workers may be bound to **different** queues; verify a process is polling **your** `<name>-task-queue`.

---

## Naming conventions

| Item | Convention | Example |
|------|-----------|---------|
| File names | `kebab-case` | `buy-us-stock.workflow.ts` |
| Task queue | `<name>-task-queue` | `buy-us-stock-task-queue` |
| Workflow function | `camelCase` + `Workflow` suffix | `buyUsStockWorkflow` |
| Input interface | PascalCase + `WorkflowInput` | `BuyUsStockWorkflowInput` |
| Worker class | `Temporal` + PascalCase + `Worker` | `TemporalBuyUsStockWorker` |
| Client class | PascalCase + `TemporalClient` | `BuyUsStockTemporalClient` |
| Signal const | `camelCase` + `Signal` suffix | `rainCardRequestSignal` |
| Workflow ID | `<name>-<key-field>-${uuidv4()}` | `buy-us-stock-${stockId}-${userId}-${uuidv4()}` |

---

## Workflow file rules

```typescript
import { proxyActivities, sleep, condition, defineSignal, setHandler, ApplicationFailure } from "@temporalio/workflow";
import type * as activities from "../activities/<name>"; // type-only import
```

- **Multiple `proxyActivities` blocks** are allowed when different activities need different timeouts/retries.
- Default activity config: `startToCloseTimeout: "2 minutes"`, `retry: { maximumAttempts: 1 }`.
- Use named constants for all timeout/interval values (e.g. `const TIMEOUT_MS = 48 * 60 * 60 * 1000`).
- **Never call DB or APIs directly** — only via activities.
- Signal names go in an exported const object:
  ```typescript
  export const myWorkflowSignals = { result: "myWorkflowResult" };
  ```
- Signal type: `defineSignal<[PayloadType]>(myWorkflowSignals.result)`.

### Waiting for signals

**With timeout (most common):**
```typescript
await Promise.race([
  condition(() => result !== null),
  sleep(TIMEOUT_MS),
]);
```

**Without timeout (rare — only when signal is mandatory):**
```typescript
await condition(() => result !== null);
```

**Timeout that throws:**
```typescript
await Promise.race([
  condition(() => approvalStatus !== null),
  sleep(7 * 24 * 60 * 60 * 1000).then(() => {
    throw new ApplicationFailure("Approval timed out");
  }),
]);
```

### Polling external status

```typescript
const deadline = Date.now() + TIMEOUT_MS;
while (Date.now() < deadline) {
  const status = await checkStatus(...);
  if (status === "SUCCESS") break;
  if (status === "FAILED") throw ApplicationFailure.nonRetryable("...", "ERROR_CODE", { ... });
  await sleep(POLL_INTERVAL_MS);
}
if (Date.now() >= deadline) throw ApplicationFailure.nonRetryable("Timed out", "TIMEOUT", { ... });
```

### Non-retryable failures

```typescript
throw ApplicationFailure.nonRetryable("Human-readable message", "UPPER_SNAKE_CASE_CODE", { contextData });
```

---

## Activity file rules

```typescript
import { ApplicationFailure } from "@temporalio/client"; // NOT from @temporalio/workflow
import { prisma } from "@meru/db";
import { SomeService } from "@meru/services";
import { logger } from "@meru/utils";
```

- Each activity is a **named async function** in its own file.
- Activities **must be idempotent** — they can be retried.
- `index.ts` re-exports everything: `export * from "./my-activity.activity";`
- Use `logger.info(...)` for observability.
- Throw `ApplicationFailure.nonRetryable(...)` for permanent failures.

---

## Worker file template (short)

```typescript
import { WorkerFactory } from "../factories/worker";
import * as activities from "../activities/<name>";

const taskQueueName = "<name>-task-queue";
const namespace = process.env.TEMPORAL_NAMESPACE || "default";

class Temporal<PascalName>Worker {
  static async run() {
    const worker = await WorkerFactory.createWorker({
      namespace,
      activities,
      taskQueueName,
      workflowPath: "../workflows/<name>.workflow",
    });
    await worker.run();
  }
}

export default Temporal<PascalName>Worker;
```

Then export this class from `packages/temporal/index.ts` and register it in `packages/api3/app.ts` — see [Registering the worker in api3](#registering-the-worker-in-api3-mandatory). Skipping that step leaves workflows stuck on “Workflow Task Scheduled”.

---

## Client file template (short)

```typescript
import { Connection, ConnectionOptions, WorkflowClient, WorkflowIdReusePolicy } from "@temporalio/client";
import { <InputType>, <workflowFn> } from "../workflows/<name>.workflow";
import { v4 as uuidv4 } from "uuid";

const taskQueueName = "<name>-task-queue";
const namespace = process.env.TEMPORAL_NAMESPACE || "default";

class <PascalName>TemporalClient {
  static async startWorkflow(input: <InputType>) {
    const address = process.env.TEMPORAL_ADDRESS || "localhost:7233";
    const apiKey = process.env.TEMPORAL_API_KEY || "";
    let connectionOptions: ConnectionOptions = { address };
    if (apiKey) {
      connectionOptions.tls = true;
      connectionOptions.apiKey = apiKey;
      connectionOptions.metadata = { "temporal-namespace": namespace };
    } else {
      connectionOptions.tls = false;
    }
    const connection = await Connection.connect(connectionOptions);
    const client = new WorkflowClient({ connection, namespace });
    const handle = await client.start(<workflowFn>, {
      args: [input],
      taskQueue: taskQueueName,
      workflowId: `<name>-<key>-${uuidv4()}`,
      workflowIdReusePolicy: WorkflowIdReusePolicy.ALLOW_DUPLICATE,
    });
    console.log(`Started Workflow ${handle.workflowId} with RunID ${handle.firstExecutionRunId}`);
    return { workflowId: handle?.workflowId || "" };
  }
}

export default <PascalName>TemporalClient;
```

---

## Existing workflows for reference

| Workflow | Patterns used |
|---------|--------------|
| `buy-us-stock` | Simple polling loop, no signals |
| `bank-account-withdrawal` | Signal + timeout, liquidity polling loop |
| `rain-card-request` | Signal + condition, multiple retry attempts, KYC flow |
| `crypto-deposit` | Multiple signals, Promise.race, fraud/compliance checks, swap polling |
| `crypto-withdrawal` | Signal + polling, two-hop logic |
| `process-physical-card-request` | Simple sequential activities, no signals |
| `near-relay-swap-reconciliation` | Sequential multi-activity: NEAR phase → Relay phase → Slack/notify |

---

## Checklist before finishing

- [ ] **At least two activities** are invoked from the workflow (not one “run all” activity)
- [ ] Workflow invokes a dedicated **final-status activity** before each terminal exit path (success/failure/timeout/error)
- [ ] Task queue name is **identical** in worker and client files
- [ ] Activity `index.ts` exports all activity functions
- [ ] No direct DB/API calls inside the workflow function
- [ ] `ApplicationFailure` imported from `@temporalio/client` in activities, from `@temporalio/workflow` in workflows
- [ ] All timeout values defined as named constants
- [ ] Signal names exported from the workflow file for use by the client
- [ ] `workflowPath` in the worker points to the correct `.workflow` file (without `.ts`)
- [ ] Worker and client exported from `packages/temporal/index.ts`
- [ ] Worker **imported and added to the `workers` array** in `packages/api3/app.ts` (non-development startup path)
