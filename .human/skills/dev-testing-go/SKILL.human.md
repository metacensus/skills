> A Go test is named for its unit, written as a table, and run at the lowest layer that can fail for its reason.

Fires: writing, reviewing, or planning Go tests; adding a seam or double; deciding what a change needs tested, and where.

Name → Table → Validate → Mock → Layer → Seam → Convention → Integration → Run

## Names run from scope to detail

`Test` + Type + `_` + Method; detail only as it grows.

```go
func TestMyThing_ItsMethod(t *testing.T)      // success and error cases, one table
func TestMyThing_ItsMethodFails(t *testing.T) // errors split out when evoking them costs more setup
func TestMyFeature_ItsBehavior(t *testing.T)  // e2e
```

Cases: `"success - …"` · `"error - …"`

## Every test is a table

One slice of cases, one `t.Run` loop, fresh doubles per case (`setupMock` is a field).

| Rule | Form |
|---|---|
| Start | settle every case (name, input, expected) before the loop |
| Order | validation errors → successes → dependency errors |
| Validation is its own constructor | its cases go in that constructor's test |
| Every case asserts | value returned · state changed · error identity |
| Test data | named builders: `adminOwner(org)`, `memberOwner(id)` |
| Repeated checks | one helper: `assertConstructorResult` |

## Validate apart from execution

| Test | Shape | Doubles |
|---|---|---|
| Validation | `newXxx(input)` → `validate()`, pure | none, no server, no environment |
| Execution | orchestration only | as needed |
| Rejection | invalid input refused before any dependency | ⚠️ none registered; any side effect fails it |

## Generated mocks standardize the double

mockery, committed config, `with-expecter: true`.

| Do | Not |
|---|---|
| `NewMockClient(t)` (asserts at cleanup) | `AssertExpectations` |
| `m.EXPECT().Method()` | `.On("Method")` |
| expect only where the code path reaches: `if tt.input.Name != "" { m.EXPECT()… }` | expect everything every case |
| `mock.MatchedBy(func(req *pb.CreateInput) bool { return req.Name == tt.input.Name })` | match any argument |
| `.Once()` exactly one call · `.Maybe()` retried or incidental | |
| package-level sentinel errors, `errClientConnectionRefused` | inline errors |
| real client errors checked with `errors.Is` on its own types | |

Mock only the direct dependency: workflow → its activities · activity → its clients.

Stateful double (uniqueness, parent existence) → in-memory fake, `var _ store.Store = (*fakeStore)(nil)`.

## Choose the layer by what a failure would mean

| Layer | A failure means | Runs against |
|---|---|---|
| Unit | logic wrong | injected seams only |
| Handler | routing, middleware, status code wrong | `httptest.NewServer`, real socket |
| Adapter | our client disagrees with the real system | dependency in a container |
| Artifact | shipped image does not boot, serve, or stop | the built image |
| End-to-end | parts disagree once assembled | our code in-process · dependencies in containers · our built images |
| Live probe | a third party rejects what we send | real third party, opt-in |
| Parity | two generated halves disagree on the wire | our server, driven by our other-language client |

Rule: lowest layer that can fail for the reason the test names.

## Every source of nondeterminism is a seam

| Seam | Enters as |
|---|---|
| Time · IDs · environment · outbound calls | a field or parameter the test sets |

One `newHarness(t, opts...)` per package wires all four: recording defaults, request helpers calling `t.Helper` and `t.Cleanup`.

## Conventions are tests, not prose

| Convention | Test |
|---|---|
| Schema (naming, enum zero values, list envelopes) | walk the compiler's registry over a declared set of governed packages; plus a test failing when a package escapes the set |
| Architecture | read `go list -deps`; assert which packages may import which |
| Security | every principal, both directions: own subtree only · no wildcard reaching another's |
| A guard | its own test proving it fires, beside the test that the code obeys it |
| Third-party signature | compile-time assertion against a local copy; dependency stays out of `go.mod` |
| Coverage floor | `TestMain` |

## Integration tests own their dependencies

| Kind | Tag | Lives |
|---|---|---|
| Adapter | `//go:build integration` | `client_integ_test.go` beside the unit `client_test.go` |
| E2E | `//go:build integration` on every file, harness too | directory `e2e` at the root of what it assembles; several allowed; files named for the feature (`sandbox_test.go`, `lease_test.go`), no `_integ`, so branches add files |
| Artifact | `//go:build artifact` (`-tags=integration ./...` skips it) | `integration/` in the root module; speaks only HTTP |
| Live probe | skips without credential | |

| Question | Answer |
|---|---|
| What starts dependencies? | testcontainers, pinned image tag, readiness via `wait.ForHTTP` · `ForLog` · `ForExit` (must refuse to boot) |
| Database per test? | clone from one template, migrations run once |
| Why not a transaction? | ⚠️ a store method commits its own |
| Why not a schema? | ⚠️ couples code to `search_path`, re-runs migrations |
| Too slow to clone? | start once in `TestMain`; each test takes a cheap handle, runs parallel, isolates by the IDs it names, creates nothing the code would not |
| Cleanup? | one `start(t, ctx, req)`: `t.Cleanup` prints container logs on failure, then terminates; `TestMain` does the same for a shared container |
| E2E layout? | shared environment and per-test handle in `e2e/harness` |
| Artifact image? | `SERVICE_IMAGE` names it; fails when unset; `make` or CI buildx builds first (only Docker supplies `$BUILDPLATFORM`) |
| Live probe credential? | test-only name (`*_TEST_URL`, never the production variable) · print only the name · skip without it · fail when `REQUIRE_*` is set |

## Running the test

| Concern | Rule |
|---|---|
| Assertions | standard `testing`; testify only as mockery's dependency |
| Concurrent server code | `-race -count=1` |
| Commands | `make test` · `test-race` · `test-integration` · `test-artifact` |
