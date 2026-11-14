> Write Temporal workflows in PFI shape under the P1-P4 security rules, then test each layer.

Fires: adding or changing a workflow, activity, service or Nexus operation; a change that derives credentials, paths or policies or crosses Nexus; asked to write or plan tests.

```
Authoring: Structure → Security → Register → Tests ─┐
                                                    ▼
Testing:   Target → Analyze → Gaps → Guidance → Clarify → Plan → ⛔ confirm
```

## Authoring

| # | Check | Link |
|---|---|---|
| 1 | Proto → generated → implementation | [pfi-pattern](references/pfi-pattern.human.md) |
| 2 | Security context is a typed identity | P1 |
| 3 | Other context only via Nexus | P2 |
| 4 | Branch on structure, no shared workflow type | P3 |
| 5 | Policies built from the path methods | P4 |
| 6 | Registered in 3 places | [registration](references/pfi-pattern.human.md#registration) |
| 7 | Tests planned | Testing |

### Checklist

Steps 1-7 above, tracked as `- [ ]` items.

### Step 1: Structure (PFI)

- ✏️ proto and implementation only; never generated code
- Right package and version

### Step 2: Security context (P1-P4)

A workflow runs with its worker's credentials. Check every row against the diff.

| | Rule | Do | Never |
|---|---|---|---|
| P1 | Worker identity is the context | Single-tenant worker: identity injected at startup, none in inputs. Acting for a tenant: typed identity (proto `oneof`), resolved once at the top | string; string + flag |
| P2 | Local child = my resources | Cross contexts by Nexus operation | child workflow; widened policy |
| P3 | Branch on structure | `parent == nil`, "is this resource mine?"; share plain functions with the caller's resolved identity | `if kind == "primary"`; shared workflow type that re-decides identity |
| P4 | Policy composed from path methods, same package | Test: change one path method, write and policy rule both move | separate path and policy strings |

### Step 3: Register

| Module exports | Wired through | Missing → |
|---|---|---|
| `RegisterActivities()`, `RegisterWorkflows()` | `fx.Module`; also `workflows.go`, `fx.go`, worker `workflows.go` | `unable to find workflowType` / `activityType` at runtime |

### Step 4: Tests

Every workflow is tested (replay safety).

## Testing

Strategy docs: [unit-testing](references/unit-testing.human.md) · [integration-testing](references/integration-testing.human.md)

### Step 1: Identify the target source file

| Path in the message | Action |
|---|---|
| given | use it |
| absent | ⛔ ask: "Which source file would you like to develop tests for? Please provide the file path." |

### Step 2: Analyze the source file

| File | Type | Existing tests | Guide |
|---|---|---|---|
| `workflows.go` | Orchestration | `workflows_test.go` (unit), `workflows_replay_test.go` (over `testdata/replay/`) | [workflows](references/unit-testing-workflows.human.md) |
| `activities.go` | External-system integration | `activities_test.go` | [activities](references/unit-testing-activities.human.md) |
| `client.go` | Client | `client_test.go` (unit, no Docker) · `client_integ_test.go` (`//go:build integration`, testcontainers) | [clients](references/unit-testing-clients.human.md) |

### Step 3: Identify test coverage gaps

Exported functions in source, minus those the test file covers.

| Test | Skip |
|---|---|
| validation, branching, error handling, external calls (clients, children, activities) | trivial getters/setters without validation |

### Step 4: Reference testing guidelines

Always [unit-testing](references/unit-testing.human.md), plus the file type's guide from Step 2, plus [integration-testing](references/integration-testing.human.md). Highlight the relevant patterns.

### Step 5: Clarify if needed

Ask before planning when unclear:

| Topic | Question |
|---|---|
| Expected behavior | what each function does |
| Error cases | which are handled |
| Dependencies | which systems and clients |
| Edge cases | which boundaries |

### Step 6: Present the testing plan

Per function, one table of table-driven cases; then ⛔ the user confirms or modifies before implementation.

| Plan part | Holds |
|---|---|
| Header | file, file type, test files (new / existing), guidance link |
| Per function | purpose · cases · mock setup · assertions |
| Summary | functions to test · new cases · complexity Low / Medium / High |

| Case name | Input | Expected |
|---|---|---|
| `success - <scenario>` | valid | output |
| `error - <validation case>` | invalid | validation error |
| `error - <dependency failure>` | valid, mock error | propagated error |
