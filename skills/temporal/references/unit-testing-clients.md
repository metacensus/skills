# Client Testing Strategy

## Overview

Client tests verify **real system behavior** using testcontainers to run actual services (Vault, PostgreSQL, etc.). Testing real systems catches bugs that mocks hide and validates that client abstractions match actual system behavior.

---

## Client Test Pattern

Test real system interaction using containerized services. No mocks.

```go
//go:build integration
// +build integration

func TestVaultClient_GenericOperations(t *testing.T) {
    if testing.Short() {
        t.Skip("skipping client test in short mode")
    }

    ctx := context.Background()

    // Start real Vault container
    req := testcontainers.ContainerRequest{
        Image:        "hashicorp/vault:1.15",
        ExposedPorts: []string{"8200/tcp"},
        Env:          map[string]string{"VAULT_DEV_ROOT_TOKEN_ID": "root"},
        WaitingFor:   wait.ForHTTP("/v1/sys/health").WithPort("8200/tcp").WithStartupTimeout(30 * time.Second),
    }

    container, err := testcontainers.GenericContainer(ctx, testcontainers.GenericContainerRequest{
        ContainerRequest: req,
        Started:          true,
    })
    if err != nil {
        t.Fatalf("failed to start vault: %v", err)
    }
    defer container.Terminate(ctx)

    host, _ := container.Host(ctx)
    port, _ := container.MappedPort(ctx, "8200")
    client := NewVaultClient(fmt.Sprintf("http://%s:%s", host, port.Port()))

    // Test real operations
    t.Run("write and read secret", func(t *testing.T) {
        if err := client.Write(ctx, "secret/data/test", map[string]any{"data": "value"}); err != nil {
            t.Fatalf("write failed: %v", err)
        }
        result, err := client.Read(ctx, "secret/data/test")
        if err != nil {
            t.Fatalf("read failed: %v", err)
        }
        if result == nil {
            t.Fatal("result is nil")
        }
    })

    t.Run("read nonexistent secret returns not found", func(t *testing.T) {
        _, err := client.Read(ctx, "secret/data/does-not-exist")
        if err == nil {
            t.Fatal("expected error for nonexistent secret")
        }
        if !errors.Is(err, ErrNotFound) {
            t.Errorf("expected ErrNotFound, got: %v", err)
        }
    })
}
```

**What to test:**
- Real system behavior (write, read, delete operations)
- Error cases (not found, forbidden, connection errors)
- Verify client abstractions match actual system behavior

---

## Build Tag: `//go:build integration`

All client tests must include the build tag:

```go
//go:build integration
// +build integration

package vault
```

This allows:
- Unit tests to run without Docker: `go test ./...`
- Client tests to run only with flag: `go test -tags=integration ./...`

---

## Container Management with testcontainers

### Starting a Container

```go
req := testcontainers.ContainerRequest{
    Image:        "hashicorp/vault:1.15",
    ExposedPorts: []string{"8200/tcp"},
    Env:          map[string]string{"VAULT_DEV_ROOT_TOKEN_ID": "root"},
    WaitingFor:   wait.ForHTTP("/v1/sys/health").
        WithPort("8200/tcp").
        WithStartupTimeout(30 * time.Second),
}

container, err := testcontainers.GenericContainer(ctx, testcontainers.GenericContainerRequest{
    ContainerRequest: req,
    Started:          true,
})
if err != nil {
    t.Fatalf("failed to start: %v", err)
}
```

### Cleanup

Always use `defer` to ensure cleanup:

```go
defer container.Terminate(ctx)
```

### Getting Connection Details

```go
host, err := container.Host(ctx)
port, err := container.MappedPort(ctx, "8200")
address := fmt.Sprintf("http://%s:%s", host, port.Port())
```

---

## Skipping Client Tests

Client tests should respect `testing.Short()` for quick test runs during development:

```go
if testing.Short() {
    t.Skip("skipping client test in short mode")
}
```

This allows:
- `go test ./...` — fast unit tests only
- `go test -short ./...` — skip client tests
- `go test -tags=integration ./...` — run client tests

---

## Running Client Tests

```bash
# Client tests (requires Docker)
make test-integration
go test -tags=integration ./...

# Specific package
go test -tags=integration ./<service>/v1

# All tests including client tests
go test -tags=integration ./...

# Client tests without short-skip
go test -tags=integration -timeout=10m ./...
```

---

## Real System Error Handling

In client tests, use real client errors, not test sentinels:

```go
// ❌ Bad: using test sentinel error
var errNotFound = errors.New("not found")
if err == errNotFound { ... }

// ✅ Good: using real client error
if !errors.Is(err, vault.ErrNotFound) {
    t.Errorf("expected vault.ErrNotFound, got: %v", err)
}
```

This validates that:
- Your code actually handles the real client errors correctly
- Your error definitions match what the system actually returns

---

## Organizing Client Tests

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

## Implementation Checklist: Client Tests

- [ ] Use `//go:build integration` build tag
- [ ] Respect `testing.Short()` to skip in quick runs
- [ ] Start containerized service with testcontainers
- [ ] Configure proper health checks (WaitingFor)
- [ ] Get connection details from container
- [ ] Clean up with `defer container.Terminate(ctx)`
- [ ] Test real behavior, not mock behavior
- [ ] Use real client errors, not test sentinels
- [ ] Use multiple `t.Run()` subtests within the test
- [ ] Test error cases (not found, forbidden, connection errors)

---

## Why Client Tests Matter

Unit tests with mocks can miss:

| Issue | Caught By Mocks? | Caught By Client Tests? |
|-------|-----------------|------------------------------|
| Wrong error type returned | ❌ No | ✅ Yes |
| Client API changed | ❌ No | ✅ Yes |
| Configuration error (ports, paths) | ❌ No | ✅ Yes |
| Timeout too short | ❌ No | ✅ Yes |
| Authentication flow broken | ❌ No | ✅ Yes |
| Data parsing incorrect | ❌ Maybe | ✅ Yes |

---

## Key Takeaways

1. **Client tests use real systems** — not mocks or stubs
2. **Tests are isolated** — each test starts fresh containers
3. **Cleanup is guaranteed** — use `defer` for container termination
4. **Build tags separate concerns** — unit tests run fast, client tests run with `-tags=integration`
5. **Real errors are validated** — not test sentinels
6. **They catch production issues** — before they reach production

---

## References

- **[unit-testing.md](unit-testing.md)** — Testing overview and layer relationships
- **[unit-testing-workflows.md](unit-testing-workflows.md)** — Workflow unit testing
- **[unit-testing-activities.md](unit-testing-activities.md)** — Activity unit testing
- **[integration-testing.md](integration-testing.md)** — Integration testing concepts
- **[pfi-pattern.md](pfi-pattern.md)** — PFI layout and registration
