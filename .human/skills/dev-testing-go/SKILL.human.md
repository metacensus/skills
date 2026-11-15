> A Go test is named for its unit, written as a table, and run at the lowest layer that can fail for its reason.

Fires: writing or planning Go tests; adding a seam or double; deciding what to test, and where.

Name → Table → Validate → Mock → Layer → Seam → Convention → Integration → Run

## Names run from scope to detail

```go
func TestMyThing_ItsMethod(t *testing.T)      // one table
func TestMyThing_ItsMethodFails(t *testing.T) // errors split out
func TestMyFeature_ItsBehavior(t *testing.T)  // e2e
```

## Every test is a table

One slice of cases, one `t.Run` loop, fresh doubles per case; validation errors → successes → dependency errors.

## Validate apart from execution

Validation is pure `newXxx(input)` → `validate()`, no doubles. ⚠️ A rejection test registers no doubles, so any side effect fails it.

## Generated mocks standardize the double

mockery `NewMockClient(t)` with `m.EXPECT()`, only what the path reaches. Mock only the direct dependency.

## Choose the layer by what a failure would mean

| Layer | A failure means |
|---|---|
| Unit | logic wrong |
| Handler | routing, middleware, status wrong |
| Adapter | our client disagrees with the system |
| Artifact | shipped image will not boot, serve, or stop |
| End-to-end | parts disagree once assembled |
| Live probe | a third party rejects what we send |
| Parity | generated halves disagree |

## Every source of nondeterminism is a seam

Time · IDs · environment · outbound calls enter as a field the test sets, via one `newHarness(t, opts...)`.

## Conventions are tests, not prose

Schema, architecture, and security rules are tests over the whole set; a guard gets a test proving it fires.

## Integration tests own their dependencies

| Kind | Tag |
|---|---|
| Adapter, E2E | `integration` |
| Artifact | `artifact` |
| Live probe | skips without credential |

Database per test: clone one template; ⚠️ not a transaction, not a schema. The artifact suite fails when `SERVICE_IMAGE` is unset; a live probe when `REQUIRE_*` is set without its credential.

## Running the test

`-race -count=1` for concurrent code; `make test` · `test-integration` · `test-artifact`.
