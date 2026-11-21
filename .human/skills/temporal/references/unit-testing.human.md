> Unit tests run in two mocked layers; a third, unmocked layer tests clients against real services.

```
Workflow tests ──mock──▶ Activities
Activity tests ──mock──▶ Clients
Client tests   ──real──▶ containerized services   (integration)
```

Every workflow MUST have tests: determinism enables replay. A [replay test](unit-testing-workflows.human.md#replay-tests) proves it for running executions.

Go-wide conventions (names, tables, mockery, testcontainers) are `dev-testing-go`'s.

## The Test Pyramid: Unit + Integration

| Layer | Tests | Runs | Guide |
|---|---|---|---|
| Clients (top) | Real behavior, `//go:build integration` | Before release, slow (Docker) | [clients](unit-testing-clients.human.md) |
| Activities | Validation → client call → output | Every commit, <1s | [activities](unit-testing-activities.human.md) |
| Workflows (base) | Order, branching, retries, determinism | Every commit, <1s | [workflows](unit-testing-workflows.human.md) |

All three together: [integration-testing](integration-testing.human.md).

## Running Unit Tests

`make test` · `go test ./...` (no Docker) · `go test ./<service>/v1` (one package) · `go test -short ./...` (skips integration)

## Key Shared Principles

1. **Make intent explicit**: `success - reserves multiple skus`, `error - missing order id`
2. **Validation first**: validation errors, then client errors, then success
3. **Mock only direct dependencies**: workflows mock activities, activities mock clients
4. **Independent, table-driven tests**: fresh setup, no order dependence
5. **Conditional mocks**: expect client calls only for valid inputs
6. **Real error handling**: sentinel errors per scenario; each error type tested separately

## Implementation Checklist

| Done when | Activity | Workflow |
|---|---|---|
| Invalid inputs first (empty, nil, boundaries) | ⬜ | · |
| Success case | ⬜ | ⬜ |
| Each client error, or child failure, separately | ⬜ | ⬜ |
| Branching logic | · | ⬜ |
| Same input → same activity order | · | ⬜ |
