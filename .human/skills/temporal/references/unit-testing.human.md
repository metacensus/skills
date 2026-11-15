> Unit tests run in two mocked layers; a third, unmocked layer tests clients against real services.

```
Workflow tests ──mock──▶ Activities
Activity tests ──mock──▶ Clients
Client tests   ──real──▶ containerized services   (integration)
```

## Overview

| Layer | File | Tests | Mocks | Coverage |
|---|---|---|---|---|
| Workflows | `workflows_test.go` | Orchestration logic | Activities | ✅ Required |
| Activities | `activities_test.go` | External system integration | Client | ✅ Required |

Every workflow MUST have tests: determinism enables replay. A [replay test](unit-testing-workflows.human.md#replay-tests) proves it for running executions.

Go-wide conventions (names, tables, mockery, testcontainers) are `dev-testing-go`'s.

## The Test Pyramid: Unit + Integration

| Layer | Tests | Mocks | Runs | Duration |
|---|---|---|---|---|
| Clients (top) | Real client behavior | Nothing | Before release | Slow (Docker) |
| Activities (middle) | Validation, error handling, output construction | Clients | Every commit | <1s |
| Workflows (base) | Orchestration order | Activities, child workflows | Every commit | <1s |

All three together: [integration-testing](integration-testing.human.md).

## Quick Reference: What Each Layer Tests

| Layer | Mock | Test | Asks | Guide |
|---|---|---|---|---|
| Workflow | Activities, child workflows | Order, branching, retries, determinism | Right order? Failures handled? | [workflows](unit-testing-workflows.human.md) |
| Activity | Clients | Input validation → client call → output | Empty inputs rejected? Client errors propagated? | [activities](unit-testing-activities.human.md) |
| Client | Nothing | Real behavior in containers, tag `//go:build integration` | Does it read and write correctly? | [clients](unit-testing-clients.human.md) |

## Test Organization

```
<service>/v1/
├── workflows.go         # Workflow implementations
├── activities.go        # Activity implementations
├── client.go            # External system client
├── workflows_test.go    # Unit tests (mock activities)
├── activities_test.go   # Unit tests (mock client)
├── client_test.go       # Client unit tests (no Docker)
└── client_integ_test.go # Client tests (real system)
                        # ↑ has //go:build integration tag
```

## Running Unit Tests

| Command | Runs |
|---|---|
| `make test` · `go test ./...` | all unit tests, no Docker |
| `go test ./<service>/v1` | one package |
| `go test -v ./...` | verbose |
| `go test -short ./...` | skips integration |

## Why Two Layers of Unit Tests?

| Layer | Asks | Catches | Misses |
|---|---|---|---|
| Workflow | Am I orchestrating correctly? | ✅ fast · determinism · order and branching | ❌ activity bugs |
| Activity | Am I validating and handling errors? | ✅ fast · validation · client errors | ❌ real client API changes |

## Key Shared Principles

Both unit layers:

1. **Make intent explicit**: names say what and why
   ```go
   {name: "success - reserves multiple skus"},
   {name: "error - missing order id"},
   {name: "error - client connection refused"},
   ```
2. **Validation first**: validation errors (no client call), then client errors, then success
3. **Mock only direct dependencies**: workflows mock activities, activities mock clients
4. **Independent tests**: fresh setup, no order dependence, table-driven
5. **Conditional mocks**: expect client calls only for valid inputs
   ```go
   if tt.input.Name != "" {
       mockClient.EXPECT().Create(mock.Anything, tt.input.Name).Return(tt.clientErr)
   }
   ```
6. **Real error handling**: sentinel errors per scenario; each error type tested separately

## Implementation Checklist

| Done when | Activity | Workflow |
|---|---|---|
| Error sentinels at package level | ⬜ | · |
| Invalid inputs first (empty, nil, boundaries) | ⬜ | · |
| Success case | ⬜ | ⬜ happy path |
| Each client error separately | ⬜ | ⬜ child failures |
| Mock expectations only for valid inputs | ⬜ | · |
| Branching logic | · | ⬜ |
| All children and activities mocked | · | ⬜ |
| Table-driven, descriptive names | ⬜ | ⬜ names show the flow |
| Determinism: same input → same activity order | · | ⬜ |

## Common Patterns

| Pattern | Code |
|---|---|
| Validation before client | `if req.Name == "" { return nil, errors.New("name required") }` |
| Conditional mock | `if tt.input.Name != "" { mockClient.EXPECT()... }` |
| Sentinel errors | `var errNotFound = errors.New("resource not found")` · `errAlreadyExists` |

## References

[integration-testing](integration-testing.human.md) · [unit-testing-workflows](unit-testing-workflows.human.md) · [unit-testing-activities](unit-testing-activities.human.md) · [unit-testing-clients](unit-testing-clients.human.md) · [pfi-pattern](pfi-pattern.human.md)
