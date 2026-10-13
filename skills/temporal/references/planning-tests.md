# Planning tests

1. **Name the target file**, or ask for it.
2. **Classify it**: `workflows.go` takes [testing-workflows.md](testing-workflows.md); `activities.go` and `client.go` take [testing-activities.md](testing-activities.md). Find its existing tests.
3. **List the gaps**: exported functions with validation, branching, error handling, or a dependency call, and no test. Skip trivial accessors.
4. **Ask what the code leaves unclear**: expected behavior, error cases, dependencies, edge cases.
5. **Present the plan, and wait for confirmation**: per function, its purpose, a case table of name, input, and expected behavior, the mocks it needs, and what it asserts.
