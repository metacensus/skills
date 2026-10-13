# Testing workflows

A workflow takes three tests:

| Test | Proves | Runs in |
|---|---|---|
| `TestNewXxxWorkflow` | validation refuses bad input | no environment |
| `TestXxxWorkflow_Execute` | today's code orchestrates correctly from a fresh start | `NewTestWorkflowEnvironment` |
| replay | today's code accepts the histories yesterday's code wrote | `worker.NewWorkflowReplayer` |

## Execution tests

- **A fresh environment per case**: a `TestWorkflowEnvironment` runs one workflow.
- **Mock direct dependencies only**: `env.OnActivity`, `env.OnWorkflow`, and `env.OnNexusOperation`, never what an activity uses.
- **Assert the result, the error, and which dependencies ran in what order**: the branches, retries, and rollbacks.

## Replay tests

A replay test feeds a recorded history through today's code and fails with a nondeterminism error when the commands diverge.

- **They live in `workflows_replay_test.go`**, one subtest per history, loaded with `ReplayWorkflowHistoryFromJSONFile`.
- **Histories live in `testdata/replay/<Workflow>/<case>.json`**, exported from a real run with `temporal workflow show --workflow-id <id> --output json`.
- **A history is added when a workflow ships**, and kept while executions of it can still be running.
