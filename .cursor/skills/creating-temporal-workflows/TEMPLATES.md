# Templates

Full copy-paste templates for each file. Replace `<name>`, `<PascalName>`, `<InputType>`, `<workflowFn>` as needed.

**Rule:** the workflow below shows **two** activities as the minimum; add more `proxyActivities` blocks or steps as the use case requires. A single-activity workflow is invalid for new work in this monorepo.

---

## 1. Workflow — `workflows/<name>.workflow.ts`

```typescript
import {
  proxyActivities,
  sleep,
  condition,
  defineSignal,
  setHandler,
  ApplicationFailure,
} from "@temporalio/workflow";
import type * as activities from "../activities/<name>";

const {
  activityOne,
  activityTwo,
} = proxyActivities<typeof activities>({
  startToCloseTimeout: "2 minutes",
  retry: {
    maximumAttempts: 1,
  },
});

// Add separate proxyActivities block only if some activities need different timeouts
// const { longRunningActivity } = proxyActivities<typeof activities>({
//   startToCloseTimeout: "10 minutes",
//   retry: { maximumAttempts: 3 },
// });

const RESULT_TIMEOUT_MS = 48 * 60 * 60 * 1000; // 48 hours

export const <camelName>Signals = {
  result: "<camelName>Result",
};

export interface <PascalName>WorkflowResult {
  status: string;
  // add fields as needed
}

const resultSignal = defineSignal<[{ result: <PascalName>WorkflowResult }]>(
  <camelName>Signals.result
);

export interface <PascalName>WorkflowInput {
  // define input fields
}

export async function <camelName>Workflow(input: <PascalName>WorkflowInput) {
  let signalResult: <PascalName>WorkflowResult | undefined;

  setHandler(resultSignal, (data: { result: <PascalName>WorkflowResult }) => {
    signalResult = data.result;
  });

  // Step 1: do work via activities
  const { someResult } = await activityOne({ ...input });

  // Step 2: wait for external signal with timeout
  await Promise.race([
    condition(() => signalResult !== undefined),
    sleep(RESULT_TIMEOUT_MS),
  ]);

  if (!signalResult) {
    signalResult = { status: "FAILED" };
  }

  // Step 3: finalize
  await activityTwo({ id: someResult.id, status: signalResult.status });

  return {
    status: signalResult.status,
  };
}
```

---

## 2. Activity — `activities/<name>/<activity-name>.activity.ts`

```typescript
import { ApplicationFailure } from "@temporalio/client";
import { prisma } from "@meru/db";
import { SomeService } from "@meru/services";
import { logger } from "@meru/utils";

interface ActivityOneInput {
  id: string;
  // add fields as needed
}

export async function activityOne(input: ActivityOneInput): Promise<{ someResult: string }> {
  logger.info(`[<PascalName>] activityOne started for id=${input.id}`);

  const record = await prisma.someModel.findUnique({ where: { id: input.id } });

  if (!record) {
    throw ApplicationFailure.nonRetryable(
      `Record ${input.id} not found`,
      "RECORD_NOT_FOUND",
      { id: input.id }
    );
  }

  const result = await SomeService.doSomething(record);

  return { someResult: result.id };
}
```

---

## 3. Activity index — `activities/<name>/index.ts`

```typescript
export * from "./activity-one.activity";
export * from "./activity-two.activity";
// add more exports as needed
```

---

## 4. Worker — `workers/<name>.worker.ts`

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

    console.log(
      `<PascalName> Worker started on task queue: ${taskQueueName}`
    );
  }
}

export default Temporal<PascalName>Worker;
```

---

## 5. Client — `clients/<name>.client.ts`

```typescript
import {
  Connection,
  ConnectionOptions,
  WorkflowClient,
  WorkflowIdReusePolicy,
} from "@temporalio/client";
import {
  <PascalName>WorkflowInput,
  <camelName>Workflow,
} from "../workflows/<name>.workflow";
import { v4 as uuidv4 } from "uuid";

const taskQueueName = "<name>-task-queue";
const namespace = process.env.TEMPORAL_NAMESPACE || "default";

class <PascalName>TemporalClient {
  static async startWorkflow(input: <PascalName>WorkflowInput) {
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

    const handle = await client.start(<camelName>Workflow, {
      args: [input],
      taskQueue: taskQueueName,
      workflowId: `<name>-${input.someKeyField}-${uuidv4()}`,
      workflowIdReusePolicy: WorkflowIdReusePolicy.ALLOW_DUPLICATE,
    });

    console.log(
      `Started Workflow ${handle.workflowId} with RunID ${handle.firstExecutionRunId}`
    );

    return { workflowId: handle?.workflowId || "" };
  }
}

export default <PascalName>TemporalClient;
```

---

## Workflow without signals (simple sequential)

When there are no external events to wait for (like `process-physical-card-request`):

```typescript
import { proxyActivities } from "@temporalio/workflow";
import type * as activities from "../activities/<name>";

const { stepOne, stepTwo, stepThree } = proxyActivities<typeof activities>({
  startToCloseTimeout: "2 minutes",
  retry: { maximumAttempts: 2 },
});

export interface <PascalName>WorkflowInput {
  id: string;
}

export async function <camelName>Workflow(input: <PascalName>WorkflowInput) {
  const result = await stepOne(input.id);
  await stepTwo(input.id, result.data);
  await stepThree(result.userId);

  return { id: result.id };
}
```
