# Workflows

## A workflow is a constructor and an Execute

```go
func (w *Workflows) Xxx(ctx workflow.Context, in *pb.XxxWorkflowInput) (pb.XxxWorkflow, error) {
    return newXxxWorkflow(in.Req)
}
```

The registered method only calls the constructor, which runs `validate()`, so `Execute` runs only on valid input and validation is tested with no environment, as [`dev-testing-go`](../../dev-testing-go/SKILL.md#validate-apart-from-execution) has it.

## Replay demands determinism

Temporal replays a workflow's history through the current code, so the code must issue the same commands in the same order for the same history:

- **I/O lives in activities**; the workflow only orchestrates.
- **Time, randomness, and concurrency come from `workflow`**: `Now`, `Sleep`, `SideEffect`, `Go`, its channels and selectors; never `time`, `rand`, `go`, `chan`, or `select`, and no command order depends on map iteration.
- **A command change ships behind `workflow.GetVersion`**, so running histories replay their old branch, and a [replay test](testing-workflows.md#replay-tests) proves it.
