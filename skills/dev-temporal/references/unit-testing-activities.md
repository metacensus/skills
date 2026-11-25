# Unit Testing Activities

## Guiding Principles for Activity Tests

### 1. Make Intent Explicit Through Test Names

Each test case name clearly describes **what** is being tested and **why it should work or fail**:

```go
// ✅ Good: intent is crystal clear
{name: "success - reserves multiple skus"},
{name: "error - missing order id"},
{name: "error - client connection refused"},

// ❌ Bad: no information
{name: "test1"},
{name: "error case"},
```

Readers should understand the test purpose without reading the test body.

### 2. Test Validation Before Mocking

Validate inputs extensively **before** testing happy paths. This respects the layered approach:
- **Validation errors** (caught before client calls) are tested independently
- **Client errors** (from external systems) are tested separately
- **Success cases** are tested last

This prevents false confidence: a test that only tests the success path may pass while validation is broken.

### 3. Only Mock What You Need to Mock

Mock **only the direct dependency** of the activity (the client). Don't mock database connections or HTTP libraries:

```go
// ✅ GOOD: mock only the client
mockClient := NewMockInventoryClient(t)
mockClient.EXPECT().Reserve(mock.Anything, mock.Anything, mock.Anything).Return(nil)

// ❌ BAD: don't mock the client's internal dependencies
env.OnCall(httpClient.Do).Return(...)
```

### 4. Each Test Case Is Completely Independent

Tests must not depend on execution order or shared state:

```go
for _, tt := range tests {
    t.Run(tt.name, func(t *testing.T) {
        // Fresh setup for every case
        env := (&testsuite.WorkflowTestSuite{}).NewTestActivityEnvironment()
        mockClient := NewMockInventoryClient(t)
        // ...
    })
}
```

### 5. Distinguish Test Errors From Real Errors

Define **sentinel errors** for test-specific scenarios; use **real client errors** for validating error handling:

```go
// ✅ Sentinel error: specific to tests
var errConnectionRefused = errors.New("connection refused")

// ✅ Real error: from actual client
if !errors.Is(err, inventory.ErrNotFound) {
    t.Error("should handle sku not found")
}
```

### 6. Conditional Mocks Reflect Real Code Flow

Only set up mock expectations if the code will actually reach them. This makes test code match implementation logic:

```go
// Set up mock only if input passes validation
if tt.input.Name != "" {
    mockClient.EXPECT().Create(mock.Anything, tt.input.Name).Return(tt.clientErr)
}
```

This pattern prevents "unexpected call" failures and makes tests self-documenting about when methods get called.

---

## Activity Test Structure

```go
var errClientNotFound = errors.New("not found")

func TestReserveStockActivity(t *testing.T) {
    tests := []struct {
        name      string
        input     *pb.ReserveStockInput
        clientErr error
        expectErr bool
    }{
        // Layer 1: Validation errors (caught before client calls)
        {name: "error - missing order id", input: &pb.ReserveStockInput{}, expectErr: true},
        {name: "error - missing warehouse", input: &pb.ReserveStockInput{OrderId: "order1"}, expectErr: true},
        {name: "error - empty sku", input: &pb.ReserveStockInput{OrderId: "order1", Warehouse: "wh1", Skus: []string{""}}, expectErr: true},

        // Layer 2: Happy path
        {name: "success - reserves one sku", input: &pb.ReserveStockInput{OrderId: "order1", Warehouse: "wh1", Skus: []string{"sku1"}}, expectErr: false},
        {name: "success - reserves multiple skus", input: &pb.ReserveStockInput{OrderId: "order1", Warehouse: "wh1", Skus: []string{"sku1", "sku2"}}, expectErr: false},

        // Layer 3: Client errors
        {name: "error - client not found", input: &pb.ReserveStockInput{OrderId: "order1", Warehouse: "wh1", Skus: []string{"sku1"}}, clientErr: errClientNotFound, expectErr: true},
        {name: "error - client connection refused", input: &pb.ReserveStockInput{OrderId: "order1", Warehouse: "wh1", Skus: []string{"sku1"}}, clientErr: errConnectionRefused, expectErr: true},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            env := (&testsuite.WorkflowTestSuite{}).NewTestActivityEnvironment()
            mockClient := NewMockInventoryClient(t)

            // Conditional mock: only expect client call if input is valid (validation happens first)
            if tt.input.OrderId != "" && tt.input.Warehouse != "" && !slices.Contains(tt.input.Skus, "") {
                mockClient.EXPECT().Reserve(mock.Anything, mock.Anything, mock.Anything).Return(tt.clientErr)
            }

            activities := NewActivities(mockClient)
            env.RegisterActivity(activities.ReserveStock)

            val, err := env.ExecuteActivity(activities.ReserveStock, tt.input)

            if tt.expectErr && err == nil {
                t.Fatal("expected error")
            }
            if !tt.expectErr && err != nil {
                t.Fatalf("unexpected error: %v", err)
            }

            // Verify output for success cases
            if !tt.expectErr {
                var output pb.ReserveStockOutput
                if err := val.Get(&output); err != nil {
                    t.Fatalf("decode output: %v", err)
                }
                if output.ReservationId == "" {
                    t.Fatal("expected a reservation id")
                }
            }
        })
    }
}
```

**What to test:**

**Layer 1: Input Validation**
- Empty or nil fields
- Invalid values (negative numbers, wrong formats)
- Missing required fields
- Boundary conditions

**Layer 2: Success Path**
- Happy path with minimal inputs
- Success path with optional inputs populated
- Verify output matches expected structure

**Layer 3: Client Errors**
- Each type of client error separately (not found, forbidden, connection failed)
- Proper error propagation

---

## Testing Strategy: Three Layers

Activities follow a three-layer validation and error handling pattern:

```
Input Validation        (caught immediately, no client calls)
    ↓
Client Call            (real system interaction)
    ↓
Output Construction    (transform response)
```

Test each layer separately:

```go
// Layer 1: Validation (input is invalid)
// → No client call should happen
// → Expect error

if tt.input.Name == "" {
    mockClient.EXPECT().Create(mock.Anything, mock.Anything).Times(0)  // Should NOT be called
}

// Layer 2: Happy path (input is valid, client succeeds)
// → Client call happens
// → No error expected

if tt.input.Name != "" && tt.clientErr == nil {
    mockClient.EXPECT().Create(mock.Anything, tt.input.Name).Return(tt.clientErr)
}

// Layer 3: Client error (input is valid, client fails)
// → Client call happens
// → Error is propagated

if tt.input.Name != "" && tt.clientErr != nil {
    mockClient.EXPECT().Create(mock.Anything, tt.input.Name).Return(tt.clientErr)
}
```

---

## Common Activity Patterns

### Pattern 1: Create and Return Resource

```go
func (a *Activities) CreateReservation(ctx context.Context, req *pb.CreateReservationInput) (*pb.CreateReservationOutput, error) {
    // Validate
    if req.OrderId == "" {
        return nil, errors.New("order id required")
    }

    // Call client
    result, err := a.client.Create(ctx, req.OrderId)
    if err != nil {
        return nil, fmt.Errorf("create reservation: %w", err)
    }

    // Return
    return &pb.CreateReservationOutput{ReservationId: result.ID}, nil
}
```

**Tests needed:**
- Validation: empty order id → error
- Success: valid input → output
- Client error: client fails → error

### Pattern 2: Get and Transform

```go
func (a *Activities) GetStock(ctx context.Context, req *pb.GetStockInput) (*pb.GetStockOutput, error) {
    // Validate
    if req.Sku == "" {
        return nil, errors.New("sku required")
    }

    // Call client
    stock, err := a.client.GetStock(ctx, req.Sku)
    if err != nil {
        return nil, fmt.Errorf("get stock: %w", err)
    }

    // Transform
    return &pb.GetStockOutput{
        Sku:       stock.Sku,
        Available: stock.Available,
        Warehouse: stock.Warehouse,
    }, nil
}
```

**Tests needed:**
- Validation: empty sku → error
- Success: valid ID → transformed output
- Client errors: not found, forbidden, timeout

### Pattern 3: List and Filter

```go
func (a *Activities) ListReservations(ctx context.Context, req *pb.ListReservationsInput) (*pb.ListReservationsOutput, error) {
    // Validate
    if req.Limit < 1 {
        return nil, errors.New("limit must be >= 1")
    }

    // Call client
    reservations, err := a.client.ListReservations(ctx, req.Warehouse, req.Limit)
    if err != nil {
        return nil, fmt.Errorf("list reservations: %w", err)
    }

    // Transform
    var protoReservations []*pb.Reservation
    for _, r := range reservations {
        protoReservations = append(protoReservations, &pb.Reservation{
            OrderId: r.OrderID,
            Id:      r.ID,
        })
    }

    return &pb.ListReservationsOutput{Reservations: protoReservations}, nil
}
```

**Tests needed:**
- Validation: limit < 1 → error
- Success: valid request → populated output
- Success: empty list → empty output
- Client error: warehouse not found

---

## Implementation Checklist: Activity Unit Tests

- [ ] Define error sentinels at package level
- [ ] Test invalid inputs first (empty, nil, boundaries)
- [ ] Test success case
- [ ] Test each type of client error separately
- [ ] Set up mock expectations only for valid inputs
- [ ] Verify output matches expectations
- [ ] Use table-driven tests with descriptive names
- [ ] Use conditional mocks to match code flow
- [ ] Mock expectations never fire for invalid inputs

---

## Error Handling Pattern

Define sentinel errors for test scenarios:

```go
var (
    errClientNotFound      = errors.New("resource not found")
    errClientAlreadyExists = errors.New("resource already exists")
    errConnectionRefused   = errors.New("connection refused")
    errPermissionDenied    = errors.New("permission denied")
)
```

Use `errors.Is()` to check sentinel errors (respects wrapping) and `errors.As()` to extract wrapped errors:

```go
if !errors.Is(err, ErrNotFound) {
    t.Errorf("expected ErrNotFound, got: %v", err)
}

// Extract wrapped error for inspection
var clientErr *inventory.ClientError
if errors.As(err, &clientErr) {
    t.Logf("client error code: %d", clientErr.Code)
}
```

---

## Running Activity Unit Tests

```bash
# All unit tests (fast, no Docker)
make test
go test ./...

# Specific package
go test ./<service>/v1

# Skip long-running tests
go test -short ./...

# Verbose output with test names
go test -v ./...
```

---

## References

- **[pfi-pattern.md](pfi-pattern.md)** — PFI layout and registration
- **[unit-testing.md](unit-testing.md)** — Testing overview
- **[unit-testing-workflows.md](unit-testing-workflows.md)** — Workflow testing
- **[integration-testing.md](integration-testing.md)** — Integration testing with real systems
