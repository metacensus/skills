> Integration testing checks that workflows orchestrate activities correctly and that clients behave correctly against real systems.

```
Workflow tests ──mock──▶ Activities
Activity tests ──mock──▶ Clients
Client tests   ──real──▶ Real System
```

## Overview

| Layer | Question | Proves |
|---|---|---|
| Workflows | Did I orchestrate correctly? | order, determinism |
| Activities | Did I validate and handle errors? | resilience |
| Clients | Does this actually work? | correctness |

## The Test Pyramid

Canonical definition: [unit-testing § The Test Pyramid](unit-testing.human.md#the-test-pyramid-unit--integration). The rest of this page holds the integration-specific view.

## Key Insight: Dependencies Flow Downward

```
Workflow ─calls─▶ Activity ─uses─▶ Client ─calls─▶ Real System
```

Each layer mocks only its direct dependency.

| Layer | Mocks |
|---|---|
| Workflow | Activities |
| Activity | Clients |
| Client | Nothing (real system) |

## Why All Three Layers?

| Layer | Kind | Docker | Catches | Misses |
|---|---|---|---|---|
| 1 Workflow | Unit | · | ✅ order (replay determinism) · ✅ conditional branching | ❌ activity bugs |
| 2 Activity | Unit | · | ✅ validation · ✅ client error handling | ❌ real client API changes |
| 3 Client | Integration | ✅ required, slower | ✅ real behavior · ✅ API changes before production · ✅ error types and messages | · |

Together: fast feedback (unit) plus production confidence (client).

## When Each Test Catches Bugs

| Scenario | Workflow | Activity | Client |
|---|---|---|---|
| Activity called in wrong order | ✅ | ❌ | ❌ |
| Workflow orchestrates out of order | ✅ | ❌ | ❌ |
| Missing input validation | ❌ | ✅ | ❌ |
| Incorrect error propagation | ❌ | ✅ | ❌ |
| Wrong error type returned | ❌ | ❌ | ✅ |
| Client API changed | ❌ | ❌ | ✅ |

## The Determinism Requirement (Temporal Workflows)

Workflows must be deterministic so replay works.

| Step | Event |
|---|---|
| 1 | Original run: A, then B, then C |
| 2 | B fails, worker crashes, new code deployed |
| 3 | Replay: A (from cache), then B (retry) |
| 4 | ⚠️ New code must call activities in the same order, or replay breaks |

Unit tests guard this by asserting activities always run in the same order.

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

## Running Tests at Each Layer

| Command | Runs |
|---|---|
| `go test ./...` | all unit tests (fast) |
| `go test -tags=integration ./...` | client tests only |
| `go test -short ./...` | skips long-running tests (includes client tests) |
| `go test ./<service>/v1` | one package |

## Building Confidence

| Layer | Asks | Gives | Runs |
|---|---|---|---|
| Workflow | Is my orchestration logic correct? | fast feedback · replay-safety determinism | every commit |
| Activity | Does it handle edge cases? | thorough input validation · external-system errors, all clients mocked | every commit |
| Client | Does it work in production? | real services in containers · matching error types and messages · slower, production-accurate | before releases |

## Key Principles Across All Layers

| # | Principle | Means |
|---|---|---|
| 1 | Make Intent Explicit | test names say what and why |
| 2 | Test Validation First | before happy paths |
| 3 | Only Mock What You Need | direct dependencies only |
| 4 | Each Test Is Independent | no shared state |
| 5 | Conditional Mocks | expectations only for valid inputs |
| 6 | Real Error Handling | test propagation of actual errors |

## References

[unit-testing](unit-testing.human.md) · [unit-testing-workflows](unit-testing-workflows.human.md) · [unit-testing-activities](unit-testing-activities.human.md) · [unit-testing-clients](unit-testing-clients.human.md) · [pfi-pattern](pfi-pattern.human.md)
