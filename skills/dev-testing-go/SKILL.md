---
name: dev-testing-go
description: How to test a Go service — test names, table-driven tests, validation apart from execution, generated mocks, the layers a test can run at, seams, conventions as tests, and container-backed integration tests. Trigger when writing, reviewing, or planning tests for Go code, adding a seam or test double, or deciding what a change needs tested and at which layer.
---

## Names run from scope to detail

The test name is the convention held most strictly. It opens with the unit under test — the type, an underscore, then the method — and adds detail only as it grows longer:

```go
func TestMyThing_ItsMethod(t *testing.T)      // success and error cases, one table
func TestMyThing_ItsMethodFails(t *testing.T) // error cases, once evoking them takes more setup than the features
func TestMyThing_OtherMethod(t *testing.T)
```

Cases are named `"success - …"` or `"error - …"`.

## Every test is a table

A test function is a slice of cases and one `t.Run` loop that builds fresh doubles per case, `setupMock` among the fields. The struct names what varies and the loop body holds what is constant, so the next case is one more entry.

- **A test starts as its table**: every case — name, input, expected — is settled before the loop is written.
- **Cases run in the order the code reaches them**: validation errors, successes, then dependency errors. Where validation is its own constructor, its cases belong to that constructor's test.
- **Every case asserts an outcome** — the value returned, the state changed, the error's identity.
- **Named builders make test data** — `adminOwner(org)`, `memberOwner(id)` — and one helper such as `assertConstructorResult` makes repeated checks, so a case states only what differs.

## Validate apart from execution

Input validation is a constructor or pure function — `newXxx(input)` calling `validate()` — tested directly, with no environment, server, or double. Execution tests then exercise orchestration, and reach an invalid input only to prove it is refused before any dependency is touched.

A rejection test registers no doubles: the code must refuse before touching any dependency, so any side effect fails it.

## Generated mocks standardize the double

mockery generates a typed mock for every interface a layer depends on, from a committed config with `with-expecter: true`.

- **Construct with `NewMockClient(t)`**; it asserts expectations at cleanup, so no test calls `AssertExpectations`.
- **Expect through `EXPECT()`, never `.On("Method")`**, so an interface change breaks stale expectations at compile time.
- **Expectations follow the code path**: set only where the code reaches — `if tt.input.Name != "" { m.EXPECT()… }` — so each case documents the path it takes.
- **The matcher names the argument that matters**: `mock.MatchedBy(func(req *pb.CreateInput) bool { return req.Name == tt.input.Name })`. `.Once()` pins a call that happens exactly once; `.Maybe()` allows one that retries or is incidental.
- **Injected failures are package-level sentinels** (`errClientConnectionRefused`); handling of the real client's errors is checked with `errors.Is` against its own types.
- **Each layer mocks only its direct dependency**: a workflow test mocks its activities; an activity test mocks its clients.

A double that must hold state across many calls — a store enforcing uniqueness and parent existence — is an in-memory fake implementing the interface, checked by `var _ store.Store = (*fakeStore)(nil)`.

## Choose the layer by what a failure would mean

| Layer | A failure means | Runs against |
|---|---|---|
| Unit | the logic is wrong | injected seams only |
| Handler | routing, middleware, or a status code is wrong | `httptest.NewServer`, a real socket |
| Adapter | our client disagrees with the real system | the dependency in a container |
| Artifact | the image that ships does not boot, serve, or stop | the built image |
| Live probe | a third party rejects what we send | the real third party, opt-in |
| Parity | two generated halves disagree on the wire | our server, driven by our other-language client |

A test belongs at the lowest layer that can fail for the reason it names.

## Every source of nondeterminism is a seam

Time, IDs, environment, and outbound calls enter through a field or parameter the test sets, and a package's tests share one `newHarness(t, opts...)` that wires all four, with recording defaults and request helpers that call `t.Helper` and `t.Cleanup`.

## Conventions are tests, not prose

- **Schema conventions** walk the registry the compiler produced — naming, enum zero values, list envelopes — over a declared set of governed packages, plus a test that fails when a package escapes the set.
- **Architecture** reads `go list -deps`, what the linker actually uses, and asserts which packages may import which.
- **A security property holds for every principal, in both directions**: each owner reaches only its own subtree, and no owner holds the wildcard that reaches another's.
- **A guard gets its own test** proving it fires, beside the test that the code obeys it.
- **A third-party signature** is pinned by a compile-time assertion against a local copy, keeping the dependency out of `go.mod`.
- **A coverage floor**, where a package promises one, lives in `TestMain`.

## Integration tests own their dependencies

- **Tagged and placed by what they import.** Integration tests carry `//go:build integration`. An adapter test sits beside its client as `client_integ_test.go`, next to the unit `client_test.go`; an artifact test speaks only HTTP and lives in an `integration/` module with its own `go.mod`.
- **testcontainers starts everything the test needs**, from a pinned image tag, and waits on a readiness strategy — `wait.ForHTTP`, `ForLog`, or `ForExit` for a container that must refuse to boot.
- **One `start(t, ctx, req)` helper** registers a `t.Cleanup` that prints container logs when the test failed, then terminates.
- **The artifact suite runs the image `SERVICE_IMAGE` names**, building the Dockerfile itself when unset.
- **A live probe** reads a credential under a test-only name (`*_TEST_URL`, never the production variable), prints only the variable's name, skips without it, and fails instead when `REQUIRE_*` is set.

**Hole: database isolation.** How tests share a database container and isolate from each other — transaction per test, schema per test, or template database — is unsettled.

## Running the test

- **Assertions use standard `testing`**; testify enters as mockery's dependency.
- **Anything a server calls concurrently runs under `-race -count=1`.**
- **The commands are `make` targets**: `test`, `test-race`, `test-integration`.
