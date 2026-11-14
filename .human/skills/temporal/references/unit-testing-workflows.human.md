> A workflow splits into a constructor that validates and an Execute that orchestrates; test each apart, then replay recorded histories.

```
input ──▶ newXxxWorkflow ──▶ Execute ──mock──▶ activities, children
             │                  │
   Constructor tests     Execution tests        (valid input only)
   no environment        test environment

recorded history ──replay──▶ today's code       (workflows_replay_test.go)
```

## Workflow Validation Pattern

```go
func newXxxWorkflow(input *pb.XxxInput) (*xxxWorkflow, error) // validates, then builds
func (w *xxxWorkflow) validate() error                        // required_field is required
func (w *Workflows) Xxx(ctx, input) (...)                     // returns newXxxWorkflow(input.Req)
```

| Benefit | Because |
|---|---|
| ✅ Validation before `Execute()` | constructor rejects bad input |
| ✅ Constructor tests fast | no workflow environment |
| ✅ Execution tests pure orchestration | input already valid |

## Test Organization: Constructor vs Execution Tests

| | Constructor | Execution |
|---|---|---|
| Test | `TestNewXxxWorkflow` | `TestXxxWorkflow_Execute` |
| Covers | validation | orchestration |
| Environment | none; call the constructor | `testsuite.WorkflowTestSuite` |
| Mocks | · | activities, child workflows |
| Input | valid and invalid | valid only |
| Speed | milliseconds | <1s |

### Constructor Tests (`TestNewXxxWorkflow`)

Table fields: `name`, `input`, `wantErr`, `errSubstr`.

| Case | Asserts |
|---|---|
| `success - valid input` | no error, workflow non-nil |
| `error - empty order id` | error contains `order_id is required`, workflow nil |

### Execution Tests (`TestXxxWorkflow_Execute`)

Table fields: `name`, `orderId`, one error per mocked step (`reserveErr`, `shipErr`), `wantErr`, `errSubstr`, `wantTracking`.

```go
env := (&testsuite.WorkflowTestSuite{}).NewTestWorkflowEnvironment()
// register and mock activities
env.ExecuteWorkflow(func(ctx workflow.Context, input *pb.FulfillOrderInput) (*pb.FulfillOrderOutput, error) {
    wf, err := workflows.FulfillOrder(ctx, &pb.FulfillOrderWorkflowInput{Req: input})
    if err != nil { return nil, err }
    return wf.Execute(ctx)
}, &pb.FulfillOrderInput{OrderId: tt.orderId})
```

## Guiding Principles for Workflow Tests

| # | Principle | Do | Never |
|---|---|---|---|
| 1 | Make intent explicit through test names | `success - orchestrates deployment in correct order` · `error - fails if child activity times out` · `error - rolls back on stage 2 failure` | `test1` · `error case` |
| 2 | Only mock what you need to mock | `env.OnActivity("CreateShipment", ...)` · `env.OnWorkflow("ValidateOrder", ...)` | `env.OnCall(inventoryClient.Reserve)` (activity internals) |
| 3 | Each test case is completely independent | fresh `NewTestWorkflowEnvironment()` per `t.Run`, table-driven | shared state · order dependence |
| 4 | Test conditional logic and branching | `skips validation if already validated` · `rolls back to checkpoint on mid-stage failure` · `retries failed activities up to limit` | one path only |

## What to Test

| In | Test |
|---|---|
| Constructor | required fields (empty, nil) · formats (`shipping_speed` is `standard` or `express`) · cross-field (A requires B) · clear error messages |
| Execution | happy path · error propagation from children and activities · if/else branches · calls in the right order · retry and backoff · cleanup and rollback on failure |

⛔ Validation is never tested in execution tests.

## Implementation Checklist: Workflow Unit Tests

| Done when | Constructor | Execution |
|---|---|---|
| Valid input succeeds | ⬜ workflow returned, no error | ⬜ happy path, valid input only |
| Each required field rejected (empty, nil) | ⬜ | · |
| Field formats rejected (enums) | ⬜ | · |
| Error messages clear and actionable | ⬜ | · |
| No workflow environment | ⬜ direct call | · |
| Child and activity failures | · | ⬜ |
| Branching (if/else) | · | ⬜ |
| Retry and backoff | · | ⬜ |
| Children and activities called with correct inputs | · | ⬜ |
| All children and activities mocked | · | ⬜ |
| Names show the flow | · | ⬜ |
| Cases independent | · | ⬜ |
| Outputs match expectations | · | ⬜ |

## Why Workflow Tests Are Critical

Replay re-runs history against new code, so orchestration must be deterministic.

```
original:  A → B ✗ crash, deploy new code
replay:    A (cached) → B (retry)      new code must run the same order, or replay breaks
```

Unit tests hold this invariant: same activity order, same input → same branch, no randomness in orchestration.

| Keep determinism | Do | Never |
|---|---|---|
| I/O | in activities; workflow only orchestrates | I/O in the workflow |
| Time, randomness, concurrency | `workflow.Now`, `Sleep`, `SideEffect`, `Go`, its channels and selectors | `time`, `rand`, `go`, `chan`, `select`; command order from map iteration |
| Changing commands or their order | behind `workflow.GetVersion`, so running histories take the old branch | ship unversioned |

## Replay Tests

| | Unit test | Replay test |
|---|---|---|
| Proves | today's code orchestrates correctly | today's code accepts the histories yesterday's code wrote |
| Starts from | fresh execution, mocked dependencies | recorded event history |
| Fails when | orchestration is wrong | a change breaks determinism for running executions |
| Lives in | `workflows_test.go` | `workflows_replay_test.go` |

❌ A unit test cannot catch nondeterminism across deploys: it starts fresh, so no history constrains it.

| Rule | Detail |
|---|---|
| Histories | `testdata/replay/<Workflow>/<case>.json`, from `temporal workflow show --workflow-id <id> --output json` |
| One subtest per history | `worker.NewWorkflowReplayer()` → register the workflow → `ReplayWorkflowHistoryFromJSONFile`; a nondeterminism error fails it |
| Add a history | when a workflow ships |
| Keep it | while executions of it can still be running |

## References

[pfi-pattern](pfi-pattern.human.md) · [unit-testing](unit-testing.human.md) · [unit-testing-activities](unit-testing-activities.human.md) · [integration-testing](integration-testing.human.md)
