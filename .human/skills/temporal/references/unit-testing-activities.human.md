> An activity test mocks only the client and checks three layers in order: validation, success, client errors.

```
Input validation ──▶ Client call ──mock──▶ Output construction
 (no client call)     (error propagates)    (transform response)

Test order:  Layer 1 errors → Layer 2 success → Layer 3 client errors
```

## Guiding Principles for Activity Tests

| # | Principle | Do | Never |
|---|---|---|---|
| 1 | Intent in the name | `success - reserves multiple skus` | `test1` · `error case` |
| 2 | Validation before mocking | Validation errors, then client errors, then success | Success-only tests: they pass while validation is broken |
| 3 | Mock only the direct dependency | `NewMockInventoryClient(t)` | the client's internals: `env.OnCall(httpClient.Do)` |
| 4 | Independent cases | Fresh `NewTestActivityEnvironment()` and mock per `t.Run` | Order dependence, shared state |
| 5 | Test errors vs real errors | Sentinel for a test scenario; `errors.Is(err, inventory.ErrNotFound)` for a real one | Mixing the two up |
| 6 | Conditional mocks | `EXPECT()` only when input passes validation | Expectations the code never reaches |

## Activity Test Structure

One table-driven test, cases grouped by layer.

| Layer | Case | `clientErr` | `expectErr` |
|---|---|---|---|
| 1 Validation | `error - missing order id` · `missing warehouse` · `empty sku` | · | ✅ |
| 2 Success | `success - reserves one sku` · `multiple skus` | · | · |
| 3 Client | `error - client not found` · `connection refused` | `errClientNotFound` · `errConnectionRefused` | ✅ |

```go
mockClient := NewMockInventoryClient(t)

// only expect the client call if input is valid
if tt.input.OrderId != "" && tt.input.Warehouse != "" && !slices.Contains(tt.input.Skus, "") {
    mockClient.EXPECT().Reserve(mock.Anything, mock.Anything, mock.Anything).Return(tt.clientErr)
}
val, err := env.ExecuteActivity(activities.ReserveStock, tt.input)
```

## Common Activity Patterns

Each: validate → client call (error wrapped with `%w`) → return. Test empty input, valid input, client failure.

| Pattern | Validate | Returns |
|---|---|---|
| Create and Return | `OrderId == ""` | `CreateReservationOutput{ReservationId}` |
| Get and Transform | `Sku == ""` | `GetStockOutput` |
| List and Filter | `Limit < 1` | `ListReservationsOutput` (also test an empty list) |

## Error Handling Pattern

| Need | Use |
|---|---|
| Test scenario error | package-level sentinels: `errClientNotFound` · `errConnectionRefused` · `errPermissionDenied` |
| Match through wrapping | `errors.Is(err, ErrNotFound)` · `errors.As(err, &clientErr)` |
