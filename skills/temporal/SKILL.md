---
name: temporal
description: Guides writing and testing Temporal workflows and activities in Go so they respect the PFI structure (proto → generated → implementation) and its security context (P1-P4), and are tested at each layer. Use when adding or modifying a workflow, activity, service, or Nexus operation, when a change derives credentials, resource paths, or access policies, or crosses a Nexus boundary, or when asked to write, plan, or improve tests for a workflow, activity, or client.
---

# Temporal

Thin orchestrator: it sequences when to read what. Do not duplicate the references — open them.

## Authoring

### Checklist

Copy and track:

```
- [ ] 1. Structure follows PFI (proto → generated → implementation)
- [ ] 2. The security context is a typed identity, never a bare string (P1)
- [ ] 3. Crossing to another security context goes through Nexus, never a direct child (P2)
- [ ] 4. Variants branch on structure/data, not labels; no workflow type shared across security contexts (P3)
- [ ] 5. Access policies are composed from the same methods that build the paths (P4)
- [ ] 6. Registered in workflows.go + fx.go + the worker's workflows.go
- [ ] 7. Tests planned (Testing, below)
```

### Step 1: Structure (PFI)

Edit proto and implementation only; never edit generated code. Confirm the target lives in the right package and version.

Canonical, with package layout, registration, and code generation: [pfi-pattern.md](references/pfi-pattern.md).

### Step 2: Security context (P1-P4)

A workflow runs with its worker's credentials. Any workflow that derives credentials, resource paths, or access policies from an identity must satisfy all four principles; check each one against your diff:

- **P1** — worker identity is the security context. A worker dedicated to one tenant has that identity injected at startup, and its inputs carry none; a workflow acting for a tenant takes a typed identity (a proto `oneof`, never a string, nor a string and a flag) and resolves it once, at the top.
- **P2** — local child = my resources: a direct child runs with the caller's credentials. Crossing to another security context is a Nexus operation, never a child workflow or a widened policy.
- **P3** — branch on structure, not labels: `parent == nil` or "is this resource mine?", never `if kind == "primary"`. Share plain functions, called with the caller's resolved identity; never share a workflow type that re-decides identity per call.
- **P4** — compose access policies from the same methods that build the paths, in the same package. Test: change one path method, and both the write and the policy rule move.

### Step 3: Register

Each service module exports `RegisterActivities()` and `RegisterWorkflows()` wired through `fx.Module`. Missing registration fails at runtime with `unable to find workflowType` (or `activityType`). See [pfi-pattern.md](references/pfi-pattern.md#registration).

### Step 4: Tests

Every workflow needs tests (replay safety). Plan them with Testing, below.

## Testing

Strategy docs for unit and integration testing live in [references/](references/).

### Step 1: Identify the target source file

If a file path is mentioned in the user's message, use that as the target source file.

If no file is mentioned, ask:
> Which source file would you like to develop tests for? Please provide the file path.

### Step 2: Analyze the source file

1. **Read the source file** to understand its contents.
2. **Determine the file type** based on the filename and contents:
   - `workflows.go` → Workflow tests (orchestration logic), plus replay tests
   - `activities.go` → Activity tests (external system integration)
   - `client.go` → Client tests (see naming convention below)
3. **Check for existing test files**:
   - Workflows: `workflows_test.go` (unit) and `workflows_replay_test.go` (replay, over `testdata/replay/`)
   - Activities: `activities_test.go`
   - Clients: **two files** — `client_test.go` (unit tests, no Docker) and `client_integ_test.go` (integration tests with testcontainers, requires `//go:build integration` tag)

### Step 3: Identify test coverage gaps

Compare the source file against any existing test file:

1. **List all exported functions/methods** substantial enough to test.
2. **Check the test file** (if it exists) for which functions already have coverage.
3. **Identify gaps**: functions that exist in source but lack coverage.

Focus on:
- Functions with meaningful logic (validation, branching, error handling)
- Functions that call external dependencies (clients, child workflows/activities)
- Skip trivial getters/setters unless they have validation logic

### Step 4: Reference testing guidelines

Always reference these testing strategy documents:

**General:**
- [unit-testing.md](references/unit-testing.md) — strategy, test pyramid, key principles

**Specific (choose based on file type):**
- Workflows → [unit-testing-workflows.md](references/unit-testing-workflows.md)
- Activities → [unit-testing-activities.md](references/unit-testing-activities.md)
- Clients → [unit-testing-clients.md](references/unit-testing-clients.md)
- Integration → [integration-testing.md](references/integration-testing.md)

Highlight the relevant patterns and principles from these documents.

### Step 5: Clarify if needed

Before proposing a plan, ensure you have enough information. If unclear, ask about:

- **Expected behavior**: What should each function do?
- **Error cases**: What errors should be handled?
- **Dependencies**: What external systems/clients does this code interact with?
- **Edge cases**: Any specific boundary conditions to test?

### Step 6: Present the testing plan

```markdown
### Testing Plan for `<filename>`

**File Type:** Workflow / Activity / Client
**Test Files:**
- Workflows: `workflows_test.go` + `workflows_replay_test.go` (new / existing)
- Activities: `activities_test.go` (new / existing)
- Clients: `client_test.go` (unit) + `client_integ_test.go` (integration)

**Guidance:** [Link to relevant strategy doc]

---

#### Functions Requiring Tests

**`FunctionName`**
- **Purpose:** Brief description of what the function does
- **Test Cases (table-driven):**
  | Test Name | Input | Expected Behavior |
  |-----------|-------|-------------------|
  | `success - <scenario>` | valid input | expected output |
  | `error - <validation case>` | invalid input | validation error |
  | `error - <dependency failure>` | valid input, mock error | propagated error |
- **Mock Setup:** What dependencies need to be mocked
- **Assertions:** What to verify (output values, error types, mock calls)

Repeat for each function.

### Summary
- Total functions to test: X
- New test cases: Y
- Estimated complexity: Low / Medium / High
```

**Ask the user to confirm or modify the plan before implementation.**
