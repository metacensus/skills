> Client tests run the real client against a containerized service: no mocks, tagged `integration`, run before release.

## Client Test Pattern

| Step | Do |
|---|---|
| 1 | `//go:build integration` tag; `testing.Short()` → `t.Skip` |
| 2 | Start the container with testcontainers; `WaitingFor` a ready log, 30s timeout |
| 3 | `defer container.Terminate(ctx)` ✅ always |
| 4 | Build the client from `container.Host` + `MappedPort` |
| 5 | One `t.Run` per behavior |

| Test | Assert |
|---|---|
| Write, read, delete | works against the real system |
| Unknown key, forbidden, connection failure | real client errors: `errors.Is(err, ErrNotFound)` |

## Build Tag and Commands

Every client test file starts with:

```go
//go:build integration
// +build integration
```

| Command | Runs |
|---|---|
| `go test ./...` | unit tests only, no Docker |
| `make test-integration` · `go test -tags=integration ./...` | client tests too (Docker) |

## Real System Error Handling

Use the client's real errors, not test sentinels: this proves your error definitions match what the system returns.

```go
// ❌ test sentinel
if err == errNotFound { ... }

// ✅ real client error
if !errors.Is(err, inventory.ErrNotFound) { ... }
```

## Why Client Tests Matter

Only client tests catch wrong error types, changed client APIs, configuration errors (ports, paths), short timeouts, broken authentication, and data parsing.

## Implementation Checklist

- [ ] Tag, `testing.Short()` guard, `WaitingFor` health check, `defer` cleanup
- [ ] Real behavior and real client errors, in `t.Run` subtests, error cases included
