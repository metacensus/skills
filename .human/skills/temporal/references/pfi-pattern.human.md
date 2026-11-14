> Proto defines the contract, generated code enforces it, your code fulfills it.

```
proto ──make gen──▶ gen (generated) ──implement──▶ lib ──register──▶ worker
 edit ✏️              never edit ❌                  edit ✏️           fx.Module
```

## Why This Pattern

| Layer | Owns | Gives |
|---|---|---|
| Proto | Contract: activities, workflows, signatures | One source of truth |
| Generated framework | Type-safe code, synced to proto | Interface enforcement |
| Implementation | Logic only | No interface plumbing |

Result: interfaces and code cannot drift; refactoring is safe.

## Three Phases

| # | Path | Holds | Edit |
|---|---|---|---|
| 1 | `proto/<service>/v1/service.proto` | rpc methods (activities and workflows) | ✏️ |
| 2 | `gen/workflows/<service>/v1/*_temporal.pb.go` | type-safe framework | ❌ generated |
| 3 | `<service>/v1/` | see below | ✏️ |

| Phase 3 file | Holds |
|---|---|
| `workflows.go` | Workflow interface implementations |
| `activities.go` | Activity interface implementations |
| `client.go` | external system client |
| `fx.go` | dependency injection |
| `*_test.go` | unit + integration tests |

## How to Use

| Step | Do | Where |
|---|---|---|
| 1 | Define the interface | `proto/orders/v1/orders.proto` |
| 2 | Generate: `make gen` | yields `ReserveStockActivity` interface, `OrderServiceWorkflowClient`, request/response types |
| 3 | Implement | `lib/workflows/orders/v1/activities.go` |
| 4 | Register | `workflows.go`, `fx.go`, then main `workflows/workflows.go` |

```protobuf
service OrderService {
  rpc ReserveStock(ReserveStockInput) returns (ReserveStockOutput);
}
```

```go
func (a *Activities) ReserveStock(ctx context.Context, req *pb.ReserveStockInput) (*pb.ReserveStockOutput, error) {
    // Your logic here
}
```

## Key Rules

| | Rule | Because |
|---|---|---|
| ✅ | Edit proto and implementation only | your domain |
| ❌ | Never edit generated code | regenerated from proto |
| ✅ | Lean on generated code | type checking, interface enforcement |
| ❌ | Don't skip registration | "activity not found" at runtime |

## Package Structure

| Path | Holds |
|---|---|
| `proto/<service>/<version>/` | interface definitions (`.proto`) |
| `gen/workflows/<service>/<version>/` | generated messages + Temporal stubs |
| `lib/workflows/<service>/<version>/` | `workflows.go`, `activities.go`, `client.go`, `fx.go` |
| `lib/workers/` | worker DI modules |
| `cmd/workers/` | worker entrypoints |
| `mocks/` | generated test mocks |

`proto/README.md` is generated (`docs-out`): edit `.proto`, not the README.

## Registration

| Module exports | Wired through | Missing → |
|---|---|---|
| `RegisterActivities()`, `RegisterWorkflows()` | `fx.Module` | compiles, then runtime `unable to find workflowType` (or `activityType`); task retries until a worker registers it |

## Code Generation

| Command | Runs |
|---|---|
| `make gen` | full generation |
| `make proto` | buf: `protoc-gen-go`, Nexus plugins, `protoc-gen-go_temporal` (with `docs-out`) |
| `make mocks` | mockery |
