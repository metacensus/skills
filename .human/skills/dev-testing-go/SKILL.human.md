How to test a Go service.

## Names run from scope to detail

The strictest convention: `TestMyThing_ItsMethod`, detail added only as a name grows. Success and error cases share a table, unless errors take enough setup to earn a `…Fails` function.

## Every test is a table

A slice of cases and one `t.Run` loop, planned before it is written, ordered as the code runs, built from named data builders, and asserting an outcome in every case.

## Validate apart from execution

Validation is tested without any environment; execution tests take valid input; a rejection test registers no doubles, so any side effect fails it.

## Generated mocks standardize the double

Typed mockery mocks assert their own expectations, follow the code path, and match the argument that matters. Each layer mocks only its direct dependency; a stateful double is a fake.

## Choose the layer by what a failure would mean

Unit, handler, adapter, built image, live third party, and cross-language parity.

## Every source of nondeterminism is a seam

Time, IDs, environment, and outbound calls are fields the test sets.

## Conventions are tests, not prose

Schema, architecture, security properties across every principal, and guards are tests.

## Integration tests own their dependencies

Tagged by suite, all in the root module; testcontainers from pinned images; each test clones a template database; the artifact suite runs an image Docker built; live probes fail in CI.

## Running the test

The race detector for concurrent code, and `make` targets as commands.
