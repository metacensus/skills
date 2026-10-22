# Unit Testing Strategy

## Overview

Unit tests comprise two layers that use mocks:

| Layer      | File                    | Tests                          | Mocks       | Coverage    |
|------------|-------------------------|--------------------------------|-------------|-------------|
| Workflows  | `workflows_test.go`     | Orchestration logic            | Activities  | ✅ Required |
| Activities | `activities_test.go`    | External system integration    | Client      | ✅ Required |

**Critical (Temporal):** Every workflow MUST have tests. Workflows must be deterministic to support replay — testing validates this invariant, and a [replay test](unit-testing-workflows.md#replay-tests) proves it holds for executions already running.

Go-wide test conventions — names, tables, mockery, testcontainers — are [`dev-testing-go`'s](../../dev-testing-go/SKILL.md); these references hold them in Temporal's terms.

---

## The Test Pyramid: Unit + Integration

Temporal code takes a three-layer testing approach:

- Workflow Unit Tests (base):
  - Test: Workflow orchestration logic
  - Mocks: Activities, child workflows

- Activity Unit Tests (middle):
  - Test: Activity input validation, error handling, output construction
  - Mocks: External system clients (databases, payment gateways, etc.)

- Client Tests (top, integration tests):
  - Test: Real client behavior against live systems
  - Mocks: None (talks to real containerized services)

**Layer Responsibilities:**

| Layer | What | Mocks | Runs | Duration |
|-------|------|-------|------|----------|
| **Workflows** | Orchestration order | Activities/workflows | Every commit | Fast (<1s) |
| **Activities** | Validation + error handling | Clients | Every commit | Fast (<1s) |
| **Clients** | Real system behavior | Nothing | Before release | Slow (needs Docker) |

**See:** [integration-testing.md](integration-testing.md) for how all three layers work together.

---

## Quick Reference: What Each Layer Tests

### Workflow Tests
- **Mock:** Activities and child workflows
- **Test:** Orchestration logic, branching, retry behavior
- **Example:** "Does the workflow call activities in correct order? Does it handle failures?"
- **Determinism:** Validates workflows are deterministic (required for replay safety)

**See:** [unit-testing-workflows.md](unit-testing-workflows.md)

### Activity Tests
- **Mock:** External system clients (databases, payment gateways, etc.)
- **Test:** Input validation, client error handling, output transformation
- **Example:** "Does the activity validate empty inputs? Does it propagate client errors?"
- **Layers:** Validation → Client Call → Output Construction

**See:** [unit-testing-activities.md](unit-testing-activities.md)

### Client Tests (Integration Testing)
- **Mock:** Nothing (tests real systems)
- **Test:** Real client behavior against containerized services
- **Example:** "Does the inventory client actually read and write stock correctly?"
- **Tag:** `//go:build integration`

**See:** [unit-testing-clients.md](unit-testing-clients.md)

---

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

---

## Running Unit Tests

```bash
# All unit tests (fast, no Docker)
make test
go test ./...

# Specific package
go test ./<service>/v1

# Verbose output
go test -v ./...

# Skip integration tests
go test -short ./...
```

---

## Why Two Layers of Unit Tests?

### Workflow Tests: "Am I orchestrating correctly?"
- ✅ Fast
- ✅ Validates determinism for replay
- ✅ Tests orchestration order and branching
- ❌ Can't catch activity bugs

### Activity Tests: "Am I validating and handling errors?"
- ✅ Fast
- ✅ Tests validation logic
- ✅ Tests error handling from clients
- ❌ Can't catch real client API changes

**Together:** They catch bugs in orchestration logic and error handling before they reach production.

---

## Key Shared Principles

**Applied to both workflow and activity unit tests:**

1. **Make Intent Explicit** — Test names describe what and why
   ```go
   {name: "success - reserves multiple skus"},
   {name: "error - missing order id"},
   {name: "error - client connection refused"},
   ```

2. **Test Validation First** — Before testing happy paths
   - Validation errors caught immediately (no client calls)
   - Client errors tested separately
   - Success cases tested last

3. **Only Mock What You Need** — Direct dependencies only
   - Workflows mock activities
   - Activities mock clients
   - This keeps tests focused

4. **Each Test Is Independent** — No shared state between tests
   - Fresh setup for every case
   - No dependencies on test execution order
   - Use table-driven tests

5. **Conditional Mocks** — Only set expectations for valid inputs
   ```go
   // Only mock if input passes validation
   if tt.input.Name != "" {
       mockClient.EXPECT().Create(mock.Anything, tt.input.Name).Return(tt.clientErr)
   }
   ```

6. **Real Error Handling** — Test propagation of actual client errors
   - Use sentinel errors for test scenarios
   - Use real client errors for error handling validation
   - Test each error type separately

---

## Implementation Checklist

### For Every Activity

- [ ] Define error sentinels at package level
- [ ] Test invalid inputs first (empty, nil, boundaries)
- [ ] Test success case
- [ ] Test each type of client error separately
- [ ] Set up mock expectations only for valid inputs
- [ ] Use table-driven tests with descriptive names

### For Every Workflow

- [ ] Test happy path succeeds
- [ ] Test error paths (child activity/workflow failures)
- [ ] Test branching logic
- [ ] Mock all child workflows and activities
- [ ] Use descriptive test case names showing the flow
- [ ] Verify determinism (same input → same activity order)

---

## Common Patterns

### Validation Layer Error Handling

```go
// Activity validates before calling client
if req.Name == "" {
    return nil, errors.New("name required")
}
```

### Conditional Mocks

```go
// Only mock if input passes validation
if tt.input.Name != "" {
    mockClient.EXPECT().Create(mock.Anything, tt.input.Name).Return(tt.clientErr)
}
```

### Sentinel Errors

```go
var (
    errNotFound      = errors.New("resource not found")
    errAlreadyExists = errors.New("resource already exists")
)
```

---


## References

- **[integration-testing.md](integration-testing.md)** — How all three layers work together
- **[unit-testing-workflows.md](unit-testing-workflows.md)** — Workflow testing strategies
- **[unit-testing-activities.md](unit-testing-activities.md)** — Activity testing strategies
- **[unit-testing-clients.md](unit-testing-clients.md)** — Client testing with testcontainers
- **[pfi-pattern.md](pfi-pattern.md)** — PFI layout and registration
