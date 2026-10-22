# Integration Testing Strategy

## Overview

Integration testing verifies that components work together correctly. For Temporal, this means testing that **workflows orchestrate activities correctly** and that **activities handle real system behavior correctly**.

---

## The Test Pyramid

See [unit-testing.md § The Test Pyramid](unit-testing.md#the-test-pyramid-unit--integration) for the canonical definition. Below: integration-specific flow and examples.

---

## Key Insight: Dependencies Flow Downward

```
Workflow
   ↓ calls
Activity
   ↓ uses
Client
   ↓ calls
Real System
```

**Testing strategy:** Each layer mocks only its direct dependency:
- Workflows mock activities
- Activities mock clients
- Clients test real systems

This creates clear separation of concerns. Each layer tests one thing:
- **Workflow tests:** "Did I orchestrate correctly?" (determinism for replay)
- **Activity tests:** "Did I validate input and handle errors?" (resilience)
- **Client tests:** "Does this actually work?" (correctness)

---

## Why All Three Layers?

### Layer 1: Workflow Tests (Unit)
- ✅ Fast (no Docker)
- ✅ Validates orchestration order (determinism for replay)
- ✅ Tests conditional branching
- ❌ Can't catch activity implementation bugs

### Layer 2: Activity Tests (Unit)
- ✅ Fast (no Docker, mock clients)
- ✅ Tests validation logic
- ✅ Tests error handling from clients
- ❌ Can't catch real client API changes

### Layer 3: Client Tests (Integration)
- ✅ Tests real system behavior
- ✅ Catches API changes before production
- ✅ Validates error types and messages
- ❌ Slower (requires Docker)

**The combination:** You get fast feedback (unit tests) plus production confidence (client tests).

---

## When Each Test Catches Bugs

| Scenario | Workflow Test | Activity Test | Client Test |
|----------|---------------|---------------|-------------|
| Activity called in wrong order | ✅ Yes | ❌ No | ❌ No |
| Missing input validation | ❌ No | ✅ Yes | ❌ No |
| Wrong error type returned | ❌ No | ❌ No | ✅ Yes |
| Client API changed | ❌ No | ❌ No | ✅ Yes |
| Incorrect error propagation | ❌ No | ✅ Yes | ❌ No |
| Workflow orchestrates out of order | ✅ Yes | ❌ No | ❌ No |

---

## The Determinism Requirement (Temporal Workflows)

Temporal workflows must be **deterministic** to support replay:

1. Original execution: "Call activity A, then B, then C"
2. Activity B fails, worker crashes, you deploy new code
3. Temporal replays: "Call A (from cache), then B (retry)"
4. **New code must call activities in same order, or replay breaks**

**Unit tests validate this invariant** by ensuring activities always execute in the same order.

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

## Running Tests at Each Layer

```bash
# All unit tests (fast)
go test ./...

# Only client tests
go test -tags=integration ./...

# Skip long-running tests (includes client tests)
go test -short ./...

# Specific package
go test ./<service>/v1
```

---

## Building Confidence

Think of each layer as answering different questions:

**Workflow tests:** "Is my orchestration logic correct?"
- Fast feedback during development
- Validates determinism for replay safety
- Run on every commit

**Activity tests:** "Does my activity handle edge cases?"
- Comprehensive input validation testing
- Error handling from external systems
- Mock all client interactions

**Client tests:** "Does this actually work in production?"
- Run real services in containers
- Validate error types and messages match
- Slower but production-accurate
- Run before releases

---

## Key Principles Across All Layers

1. **Make Intent Explicit** — Test names describe what and why
2. **Test Validation First** — Before testing happy paths
3. **Only Mock What You Need** — Direct dependencies only
4. **Each Test Is Independent** — No shared state
5. **Conditional Mocks** — Only set expectations for valid inputs
6. **Real Error Handling** — Test propagation of actual errors

---

## References

- **[unit-testing.md](unit-testing.md)** — Testing overview with shared principles
- **[unit-testing-workflows.md](unit-testing-workflows.md)** — Workflow unit testing
- **[unit-testing-activities.md](unit-testing-activities.md)** — Activity unit testing
- **[unit-testing-clients.md](unit-testing-clients.md)** — Client testing with testcontainers
- **[pfi-pattern.md](pfi-pattern.md)** — PFI layout and registration
