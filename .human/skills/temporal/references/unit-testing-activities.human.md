> An activity test mocks only the client and checks three layers in order: validation, success, client errors.

```
Input validation ──▶ Client call ──mock──▶ Output construction
 (no client call)     (error propagates)    (transform response)

Test order:  Layer 1 errors → Layer 2 success → Layer 3 client errors
```

## Guiding Principles for Activity Tests

| # | Principle | Do | Never |
|---|---|---|---|
| 1 | Intent in the name | `success - reserves multiple skus` · `error - missing order id` · `error - client connection refused` | `test1` · `error case` |
| 2 | Validation before mocking | Test validation errors, then client errors, then success | Success-only tests: they pass while validation is broken |
| 3 | Mock only the direct dependency | Mock the client: `NewMockInventoryClient(t)` | Mock the client's internals: `env.OnCall(httpClient.Do)` |
| 4 | Independent cases | Fresh `NewTestActivityEnvironment()` and mock per `t.Run` | Order dependence, shared state |
| 5 | Test errors vs real errors | Sentinel for a test scenario: `errConnectionRefused`; real client error checked with `errors.Is(err, inventory.ErrNotFound)` | Mixing the two up |
| 6 | Conditional mocks | `EXPECT()` only when input passes validation: `if tt.input.Name != "" {…}` | Expectations on paths the code never reaches: "unexpected call" failures |

## Activity Test Structure

One table-driven test, cases grouped by layer; the mock expectation is set only for valid input.

| Layer | Case | Input | `clientErr` | `expectErr` |
|---|---|---|---|---|
| 1 Validation | `error - missing order id` | empty | · | ✅ |
| 1 Validation | `error - missing warehouse` | order id only | · | ✅ |
| 1 Validation | `error - empty sku` | `Skus: []string{""}` | · | ✅ |
| 2 Success | `success - reserves one sku` | valid, 1 sku | · | · |
| 2 Success | `success - reserves multiple skus` | valid, 2 skus | · | · |
| 3 Client | `error - client not found` | valid | `errClientNotFound` | ✅ |
| 3 Client | `error - client connection refused` | valid | `errConnectionRefused` | ✅ |

```go
env := (&testsuite.WorkflowTestSuite{}).NewTestActivityEnvironment()
mockClient := NewMockInventoryClient(t)

// Conditional mock: only expect client call if input is valid (validation happens first)
if tt.input.OrderId != "" && tt.input.Warehouse != "" && !slices.Contains(tt.input.Skus, "") {
    mockClient.EXPECT().Reserve(mock.Anything, mock.Anything, mock.Anything).Return(tt.clientErr)
}

activities := NewActivities(mockClient)
env.RegisterActivity(activities.ReserveStock)
val, err := env.ExecuteActivity(activities.ReserveStock, tt.input)
// error expected → err != nil; else decode val into pb.ReserveStockOutput, ReservationId != ""
```

| Layer | What to test |
|---|---|
| 1 Input validation | Empty or nil fields · invalid values (negative, wrong format) · missing required fields · boundaries |
| 2 Success path | Minimal inputs · optional inputs populated · output matches expected structure |
| 3 Client errors | Each type separately (not found, forbidden, connection failed) · error propagation |

## Testing Strategy: Three Layers

| Layer | Input | Client call | Mock expectation |
|---|---|---|---|
| 1 Validation | invalid | ❌ never | `Times(0)` |
| 2 Happy path | valid, client succeeds | ✅ | `.Return(nil)` when `tt.input.Name != "" && tt.clientErr == nil` |
| 3 Client error | valid, client fails | ✅ | `.Return(tt.clientErr)` when `tt.input.Name != "" && tt.clientErr != nil`; error propagated |

## Common Activity Patterns

Every pattern is validate → client call (error wrapped with `%w`) → return.

| Pattern | Validate | Returns | Tests needed |
|---|---|---|---|
| 1 Create and Return Resource | `OrderId == ""` → error | `CreateReservationOutput{ReservationId}` | empty order id → error · valid → output · client fails → error |
| 2 Get and Transform | `Sku == ""` → error | `GetStockOutput` (Sku, Available, Warehouse) | empty sku → error · valid → transformed output · not found, forbidden, timeout |
| 3 List and Filter | `Limit < 1` → error | `ListReservationsOutput` | limit < 1 → error · valid → populated · empty list → empty output · warehouse not found |

### Pattern 1: Create and Return Resource

```go
if req.OrderId == "" { return nil, errors.New("order id required") }
result, err := a.client.Create(ctx, req.OrderId)
if err != nil { return nil, fmt.Errorf("create reservation: %w", err) }
return &pb.CreateReservationOutput{ReservationId: result.ID}, nil
```

### Pattern 2: Get and Transform

Same shape: `req.Sku == ""` rejected, `a.client.GetStock`, then copy `Sku`, `Available`, `Warehouse` into the output.

### Pattern 3: List and Filter

Same shape: `req.Limit < 1` rejected, `a.client.ListReservations(ctx, req.Warehouse, req.Limit)`, then map each result to `pb.Reservation{OrderId, Id}`.

## Implementation Checklist: Activity Unit Tests

- ⬜ Error sentinels at package level
- ⬜ Invalid inputs first (empty, nil, boundaries)
- ⬜ Success case
- ⬜ Each client error type separately
- ⬜ Mock expectations only for valid inputs, and none ever fire for invalid ones
- ⬜ Output verified against expectations
- ⬜ Table-driven, descriptive names
- ⬜ Conditional mocks match code flow

## Error Handling Pattern

| Need | Use |
|---|---|
| Test scenario error | package-level sentinels: `errClientNotFound` · `errClientAlreadyExists` · `errConnectionRefused` · `errPermissionDenied` |
| Match, through wrapping | `errors.Is(err, ErrNotFound)` |
| Extract wrapped error | `errors.As(err, &clientErr)` with `var clientErr *inventory.ClientError`; then read `clientErr.Code` |

## Running Activity Unit Tests

| Command | Runs |
|---|---|
| `make test` · `go test ./...` | all unit tests, fast, no Docker |
| `go test ./<service>/v1` | one package |
| `go test -short ./...` | skips long-running tests |
| `go test -v ./...` | verbose, with test names |

## References

[pfi-pattern](pfi-pattern.human.md) (layout, registration) · [unit-testing](unit-testing.human.md) (overview) · [unit-testing-workflows](unit-testing-workflows.human.md) · [integration-testing](integration-testing.human.md) (real systems)
