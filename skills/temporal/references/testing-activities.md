# Testing activities and clients

An activity validates its input, calls its client, and builds its output; its test mocks the client and nothing beneath it.

- **Run it in `NewTestActivityEnvironment`**, fresh per case: register the activity built over the mock client, then `env.ExecuteActivity` and `val.Get(&out)`.
- **Cases cover the three steps in order**: validation errors with no client expectation, successes with minimal and with optional inputs, then each kind of client error — not found, forbidden, connection refused — separately.
- **Wrapped errors keep their identity**: the activity wraps with `%w`, and the test checks `errors.Is` against the client's own errors.

A client is tested against the real system, in `client_integ_test.go` beside the unit `client_test.go`, as [`dev-testing-go`](../../dev-testing-go/SKILL.md#integration-tests-own-their-dependencies) has it.
