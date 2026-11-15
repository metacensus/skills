> Client tests run the real client against a containerized service: no mocks, tagged `integration`, run before release.

```
Workflow tests ──mock──▶ Activities
Activity tests ──mock──▶ Clients
Client tests   ──real──▶ containerized services   (Docker, `-tags=integration`)
```

## Overview

| Uses | Catches | Mocks |
|---|---|---|
| testcontainers: real Redis, PostgreSQL, etc. | bugs mocks hide; client abstractions that differ from the system | Nothing |

## Client Test Pattern

| Step | Do |
|---|---|
| 1 | `//go:build integration` tag; `testing.Short()` → `t.Skip` |
| 2 | Start container; `WaitingFor` a ready log, 30s timeout |
| 3 | `defer container.Terminate(ctx)` |
| 4 | Build client from `container.Host` + `MappedPort` |
| 5 | One `t.Run` per behavior |

| Test | Assert |
|---|---|
| Write, read, delete | operation works against the real system |
| Unknown key | `errors.Is(err, ErrNotFound)` |
| Forbidden, connection failure | real client errors |

## Build Tag: `//go:build integration`

Every client test file starts with:

```go
//go:build integration
// +build integration

package inventory
```

| Command | Runs |
|---|---|
| `go test ./...` | unit tests only, no Docker |
| `go test -tags=integration ./...` | client tests too |

## Container Management with testcontainers

| Step | Call |
|---|---|
| Start | `testcontainers.GenericContainer(ctx, {ContainerRequest: req, Started: true})`; req = `Image`, `ExposedPorts`, `WaitingFor` |
| Cleanup | `defer container.Terminate(ctx)` ✅ always |
| Connect | `container.Host(ctx)` + `container.MappedPort(ctx, "6379")` → `host:port.Port()` |

## Skipping Client Tests

Guard each client test with `if testing.Short() { t.Skip("skipping client test in short mode") }`.

| Command | Runs |
|---|---|
| `go test ./...` | fast unit tests only |
| `go test -short ./...` | skips client tests |
| `go test -tags=integration ./...` | runs client tests |

## Running Client Tests

Requires Docker.

| Command | Runs |
|---|---|
| `make test-integration` · `go test -tags=integration ./...` | all |
| `go test -tags=integration ./<service>/v1` | one package |
| `go test -tags=integration -timeout=10m ./...` | without short-skip, longer timeout |

## Real System Error Handling

Use the client's real errors, not test sentinels.

```go
// ❌ test sentinel
if err == errNotFound { ... }

// ✅ real client error
if !errors.Is(err, inventory.ErrNotFound) { ... }
```

This proves the code handles real client errors, and that your error definitions match what the system returns.

## Organizing Client Tests

```
<service>/v1/
├── client.go            # External system client
├── client_test.go       # Client unit tests (no Docker)
└── client_integ_test.go # Client tests (real system)
                        # ↑ has //go:build integration tag
```

Workflow and activity test files: [unit-testing](unit-testing.human.md#test-organization).

## Implementation Checklist: Client Tests

- [ ] `//go:build integration` tag
- [ ] Respect `testing.Short()`
- [ ] Containerized service via testcontainers
- [ ] Health check (`WaitingFor`)
- [ ] Connection details from the container
- [ ] `defer container.Terminate(ctx)`
- [ ] Real behavior, not mock behavior
- [ ] Real client errors, not test sentinels
- [ ] Multiple `t.Run()` subtests
- [ ] Error cases: not found, forbidden, connection

## Why Client Tests Matter

| Issue | Mocks | Client tests |
|---|---|---|
| Wrong error type returned | ❌ | ✅ |
| Client API changed | ❌ | ✅ |
| Configuration error (ports, paths) | ❌ | ✅ |
| Timeout too short | ❌ | ✅ |
| Authentication flow broken | ❌ | ✅ |
| Data parsing incorrect | ❌ maybe | ✅ |

## Key Takeaways

1. Real systems, not mocks or stubs
2. Isolated: each test starts fresh containers
3. Cleanup guaranteed by `defer`
4. Build tags split fast unit runs from `-tags=integration` runs
5. Real errors validated, not sentinels
6. Production issues caught before production

## References

[unit-testing](unit-testing.human.md) · [unit-testing-workflows](unit-testing-workflows.human.md) · [unit-testing-activities](unit-testing-activities.human.md) · [integration-testing](integration-testing.human.md) · [pfi-pattern](pfi-pattern.human.md)
