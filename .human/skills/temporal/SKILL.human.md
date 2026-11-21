> Write Temporal workflows in PFI shape under the P1-P4 security rules, then test each layer.

Fires: changing a workflow, activity, service or Nexus operation; deriving credentials, paths or policies; crossing Nexus; planning tests.

```
Authoring: Structure → Security → Register → Tests ─┐
                                                    ▼
Testing:   Target → Analyze → Gaps → Guidance → Clarify → Plan → ⛔ confirm
```

## Authoring

Edit proto and implementation, never generated code ([pfi-pattern](references/pfi-pattern.human.md)). Every workflow is tested. Inputs and results land in history: a secret's name or an object's key, never its value.

| | Rule | Do | Never |
|---|---|---|---|
| P1 | Worker identity is the context | Inject identity at startup, or take a typed identity (proto `oneof`), resolved once | string |
| P2 | Local child = my resources | Cross by Nexus operation | child workflow; widened policy |
| P3 | Branch on structure | `parent == nil`; plain functions | `if kind == "primary"`; shared workflow type |
| P4 | Policy composed from path methods | Same package: one path change moves both | separate strings |

Register `RegisterActivities()` and `RegisterWorkflows()` through `fx.Module` or it fails at runtime ([registration](references/pfi-pattern.human.md#registration)).

## Testing

[unit-testing](references/unit-testing.human.md) · [integration-testing](references/integration-testing.human.md)

| Step | Do |
|---|---|
| Target · Clarify | path in the message, else ⛔ ask; ask if unclear |
| Analyze · Gaps | by file, below; untested exported functions, not trivial getters |
| Plan | per function: cases, mocks, assertions; ⛔ user confirms |

| File | Existing tests | Guide |
|---|---|---|
| `workflows.go` | `workflows_test.go`, `workflows_replay_test.go` | [workflows](references/unit-testing-workflows.human.md) |
| `activities.go` | `activities_test.go` | [activities](references/unit-testing-activities.human.md) |
| `client.go` | `client_test.go` · `client_integ_test.go` | [clients](references/unit-testing-clients.human.md) |
