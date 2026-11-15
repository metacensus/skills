> Integration testing checks that workflows orchestrate activities correctly and that clients behave correctly against real systems.

```
Workflow ─calls─▶ Activity ─uses─▶ Client ─calls─▶ Real System
 mocks Activities   mocks Clients    mocks nothing
```

## Why All Three Layers?

| Layer | Catches | Misses |
|---|---|---|
| 1 Workflow (unit) | ✅ order (replay determinism) · branching | ❌ activity bugs |
| 2 Activity (unit) | ✅ validation · client error handling | ❌ real client API changes |
| 3 Client (integration, Docker, slower) | ✅ real behavior · API changes · error types | · |

Fast feedback from unit tests, production confidence from client tests. Pyramid: [unit-testing](unit-testing.human.md#the-test-pyramid-unit--integration).

## The Determinism Requirement

Replay reruns a workflow against recorded history:

`A → B → C` · B fails, deploy · replay `A` (cached) → `B` (retry) · ⚠️ new code must call activities in the same order, or replay breaks

Unit tests guard this by asserting the order.

## Running Tests at Each Layer

`go test ./...` (all unit tests) · `go test -tags=integration ./...` (client tests only) · `go test -short ./...` (skips client tests)
