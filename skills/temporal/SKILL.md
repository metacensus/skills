---
name: temporal
description: How to write and test Temporal workflows in Go — proto as the contract, the constructor-and-Execute shape, determinism, ownership and Nexus boundaries, the test environments, and replay tests. Trigger when adding or changing a Temporal workflow, activity, Nexus operation, or the proto that defines them, and when planning or writing their tests.
---

## Proto is the contract

Three layers, one direction: proto declares each workflow and activity, a generator (`protoc-gen-go-temporal`) turns it into typed framework code, and the implementation fulfils it.

```text
proto/<service>/v1/<service>.proto   the contract: rpc methods, inputs, outputs
gen/<service>/v1/                    generated
<service>/v1/                        workflows.go, activities.go, client.go, fx.go
```

- **Edit the `.proto` and the implementation, never `gen/` or the `docs-out` reference**; both are regenerated over any edit, and an implementation that drifts from the proto fails to compile.
- **Every module registers itself.** It exports `RegisterWorkflows` and `RegisterActivities` through its DI module, and the worker includes that module; a missed one compiles, and its tasks fail at runtime with `unable to find workflowType` (or `activityType`), leaving the execution stuck.

## A workflow is a constructor and an Execute

```go
func (w *Workflows) Xxx(ctx workflow.Context, in *pb.XxxWorkflowInput) (pb.XxxWorkflow, error) {
    return newXxxWorkflow(in.Req)
}
```

The registered method only calls the constructor, so `Execute` runs only on valid input; validation is [`dev-testing-go`'s](../dev-testing-go/SKILL.md#validate-apart-from-execution).

Temporal replays a workflow's history through the current code, so the code must issue the same commands in the same order for the same history:

- **I/O lives in activities**; the workflow only orchestrates.
- **Time, randomness, and concurrency come from `workflow`**: `Now`, `Sleep`, `SideEffect`, `Go`, its channels and selectors; never `time`, `rand`, `go`, `chan`, or `select`, and no command order depends on map iteration.
- **A change to the commands a history replays — which, or in what order — ships behind `workflow.GetVersion`**, so histories already running replay down their old branch.

## Ownership is the worker's identity

A workflow executes in exactly one security context, its worker's owner. Every secret path, namespace, and access policy derives from that one identity.

- **Act as the worker, or for a typed owner.** A worker that serves one owner has it injected at startup, and its inputs carry none. A provisioning workflow takes a typed owner — a proto `oneof`, never a string or a string and a flag — and resolves it once at the top.
- **A child workflow is mine; Nexus is someone else's.** A child, left on the parent's task queue, runs on the caller's worker with the caller's credentials; never point one at another owner's queue. Reaching another owner's resources goes through a Nexus operation, the authorization and audit boundary, carrying only what may cross.
- **Branch on structure, not labels.** `issuer == nil` and "is this issuer mine?" make each variant follow from its data; `if kind == "tls"` scatters ownership assumptions across call sites. Share plain functions across security contexts, never a workflow type with an owner switch.
- **Policies are generated from the methods that build the paths**, in the same package, never assembled by hand elsewhere. Test it: change one path method and both the write and the policy rule move.

## Testing adds environments and replay

Layers, tables, mocks, and containers are [`dev-testing-go`'s](../dev-testing-go/SKILL.md); child workflows and Nexus operations are mocked like activities.

| File | Test | Runs in |
|---|---|---|
| `workflows.go` | `TestNewXxxWorkflow`: validation | no environment |
| `workflows.go` | `TestXxxWorkflow_Execute`: orchestration | `NewTestWorkflowEnvironment` |
| `activities.go` | `TestActivities_Xxx`: validation, client errors | `NewTestActivityEnvironment` |
| `client.go` | adapter, in `client_integ_test.go` | a container |
| `workflows.go` | replay of recorded histories | `worker.NewWorkflowReplayer` |

- **Execution tests take valid input only**, in a fresh environment per case, mocking direct dependencies with `env.OnActivity`, `env.OnWorkflow`, and `env.OnNexusOperation`. They assert the result, the error, and which dependencies ran in what order: the branches, retries, and rollbacks.
- **A replay test proves today's code accepts the histories yesterday's code wrote**, failing with a nondeterminism error when it does not; an execution test, from a fresh start, cannot. Replay tests live in `workflows_replay_test.go`, one subtest per history in `testdata/replay/<Workflow>/<case>.json`, exported from a real run with `temporal workflow show --workflow-id <id> --output json`. A history is added when a workflow ships and kept while executions of it can still be running.

## Plan tests before writing them

1. **Name the target file**, or ask for it.
2. **Classify it** by the table above, and find its existing tests.
3. **List the gaps**: exported functions with validation, branching, error handling, or a dependency call, and no test. Skip trivial accessors.
4. **Ask what the code leaves unclear**: expected behavior, error cases, dependencies, edge cases.
5. **Present the plan, and wait for confirmation**: per function, its purpose, a case table of name, input, and expected behavior, the mocks it needs, and what it asserts.
