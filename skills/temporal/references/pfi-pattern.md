# Proto-Framework-Implementation (PFI) Pattern

**Single source of truth for Temporal workflow interfaces. Proto defines contracts, code generation provides type safety, you implement the logic.**

## Why This Pattern

Three layers with clear responsibilities prevent divergence between interface definitions and implementations:

- **Proto** defines the contract (what activities and workflows exist, their signatures)
- **Generated framework** provides type-safe code that's kept in sync with proto automatically
- **Implementation** focuses on logic without managing interface plumbing

This keeps interfaces and code from drifting apart and makes refactoring safe.

## Three Phases

```
1. proto/<service>/v1/service.proto
   └─ Define rpc methods (activities and workflows)

2. gen/workflows/<service>/v1/*_temporal.pb.go (generated, don't edit)
   └─ Type-safe framework (generated from proto)

3. <service>/v1/
   ├─ workflows.go       (implement Workflow interfaces)
   ├─ activities.go      (implement Activity interfaces)
   ├─ client.go          (external system client)
   ├─ fx.go              (dependency injection)
   └─ *_test.go          (unit + integration tests)
```

## How to Use

**1. Define the interface (proto)**
```protobuf
// proto/orders/v1/orders.proto
service OrderService {
  rpc ReserveStock(ReserveStockInput) returns (ReserveStockOutput);
}
```

**2. Generate (automatic, via `make gen`)**
The generated code provides:
- `ReserveStockActivity` interface to implement
- `OrderServiceWorkflowClient` for calling workflows
- Request/response types

**3. Implement (your code)**
```go
// lib/workflows/orders/v1/activities.go
func (a *Activities) ReserveStock(ctx context.Context, req *pb.ReserveStockInput) (*pb.ReserveStockOutput, error) {
    // Your logic here
}
```

Register in `workflows.go` and `fx.go`, then add to main `workflows/workflows.go`.

## Key Rules

- ✅ **Edit proto and implementation only** — These are your domain
- ❌ **Never edit generated code** — It's regenerated from proto
- ✅ **Generated code is your safety net** — Type checking, interface enforcement
- ❌ **Don't skip registration** — Missing registration causes "activity not found" at runtime

## Package Structure

```text
proto/<service>/<version>/           # Interface definitions (.proto)
gen/workflows/<service>/<version>/   # Generated messages + Temporal stubs
lib/workflows/<service>/<version>/   # workflows.go, activities.go, client.go, fx.go
lib/workers/                         # Worker DI modules
cmd/workers/                         # Worker entrypoints
mocks/                               # Generated test mocks
```

`proto/README.md` is **generated** by the Temporal plugin's `docs-out` option — edit `.proto` files, not that README.

## Registration

Each service module must export `RegisterActivities()` and `RegisterWorkflows()` and be wired through `fx.Module`. Missing registration compiles, then fails at runtime with `unable to find workflowType` (or `activityType`), and the task retries until a worker registers it.

## Code Generation

`make gen`, `make proto`, `make mocks`: buf runs `protoc-gen-go`, the Nexus plugins, and `protoc-gen-go_temporal` (with `docs-out`); mockery generates the mocks.

---

**Philosophy:** Proto is the contract, generated code enforces it, your code fulfills it. Clean separation of concerns.

