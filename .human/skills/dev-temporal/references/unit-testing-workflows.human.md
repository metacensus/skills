> A workflow splits into a constructor that validates and an Execute that orchestrates; test each apart, then replay recorded histories.

```
input ──▶ newXxxWorkflow ──▶ Execute ──mock──▶ activities, children
             │                  │
   Constructor tests     Execution tests        (valid input only)
   no environment        test environment

recorded history ──replay──▶ today's code       (workflows_replay_test.go)
```

## Workflow Validation Pattern

`newXxxWorkflow(input)` validates and builds; `Workflows.Xxx` returns it. Validation runs before `Execute()`, so constructor tests need no environment and execution tests see only valid input.

## Test Organization: Constructor vs Execution Tests

| | Constructor | Execution |
|---|---|---|
| Covers | validation: required fields, formats, cross-field rules, clear messages | orchestration: happy path, error propagation, branches, call order, retry, rollback |
| Test | `TestNewXxxWorkflow` | `TestXxxWorkflow_Execute` |
| Environment | none; call the constructor | `testsuite.WorkflowTestSuite` |
| Mocks | · | activities, child workflows |
| Input | valid and invalid | valid only; ⛔ no validation tests |

## Guiding Principles for Workflow Tests

Name the intent (`error - rolls back on stage 2 failure`, not `test1`) · mock only direct dependencies (`env.OnActivity(...)`, never `env.OnCall(inventoryClient.Reserve)`) · a fresh environment per `t.Run` · test every branch, retry included.

## Why Workflow Tests Are Critical

Replay re-runs history against new code, so orchestration must be deterministic.

```
original:  A → B ✗ crash, deploy new code
replay:    A (cached) → B (retry)      new code must run the same order, or replay breaks
```

| Keep determinism | Do | Never |
|---|---|---|
| I/O | in activities | in the workflow |
| Time, randomness, concurrency | `workflow.Now`, `SideEffect`, `Go`, channels, selectors | `time`, `rand`, `go`, `chan`, `select`; map-iteration order |
| Changing commands or their order | behind `workflow.GetVersion` | unversioned |

## Replay Tests

| | Unit test | Replay test |
|---|---|---|
| Proves | today's code orchestrates correctly | today's code accepts the histories yesterday's code wrote |
| Lives in | `workflows_test.go` | `workflows_replay_test.go` |

❌ A unit test cannot catch nondeterminism across deploys: it starts fresh, so no history constrains it.

- Histories: `testdata/replay/<Workflow>/<case>.json`, from `temporal workflow show --workflow-id <id> --output json`
- One subtest per history: `worker.NewWorkflowReplayer()` → register → `ReplayWorkflowHistoryFromJSONFile`; a nondeterminism error fails it
- Add a history when a workflow ships; keep it while executions of it can still run
