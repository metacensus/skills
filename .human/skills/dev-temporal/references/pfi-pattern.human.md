> Proto defines the contract, generated code enforces it, your code fulfills it.

```
proto ──make gen──▶ gen (generated) ──implement──▶ lib ──register──▶ worker
 edit ✏️              never edit ❌                  edit ✏️           fx.Module
```

## Package Structure

| Path | Holds |
|---|---|
| `proto/<service>/<version>/` | `.proto` contracts (`README.md` is generated: edit the `.proto`) |
| `gen/workflows/<service>/<version>/` | generated stubs, never edited |
| `lib/workflows/<service>/<version>/` | `workflows.go`, `activities.go`, `client.go`, `fx.go` |
| `lib/workers/` · `cmd/workers/` | worker DI · entrypoints |
| `mocks/` | generated mocks |

## Registration

Export `RegisterActivities()` and `RegisterWorkflows()` through `fx.Module`. Missing: it compiles, then fails at runtime with `unable to find workflowType`.

## Code Generation

`make gen` · `make proto` (buf) · `make mocks` (mockery)
