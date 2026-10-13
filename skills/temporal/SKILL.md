---
name: temporal
description: How to write and test Temporal workflows in Go — proto as the contract, the constructor-and-Execute shape, determinism, ownership and Nexus boundaries, the test environments, and replay tests. Trigger when adding or changing a Temporal workflow, activity, Nexus operation, or the proto that defines them, and when planning or writing their tests.
---

## Proto is the contract

Three layers, one direction: proto declares each workflow and activity, a generator (`protoc-gen-go-temporal`) turns it into typed framework code, and the implementation fulfils it.

```text
proto/<service>/v1/<service>.proto   the contract: rpc methods, inputs, outputs
gen/<service>/v1/                    generated
<service>/v1/                        workflows.go, activities.go, client.go, fx.go
```

- **Edit the `.proto` and the implementation, never generated output**; it is regenerated over any edit, and an implementation that drifts from the proto fails to compile.
- **Every module registers itself.** It exports `RegisterWorkflows` and `RegisterActivities` through its DI module, and the worker includes that module; a missed one compiles, and its tasks fail at runtime with `unable to find workflowType` (or `activityType`) and retry until a worker registers it.

## Read what the task touches

| When the task | Read |
|---|---|
| writes or changes a workflow body | [workflows.md](references/workflows.md) |
| derives a secret path, namespace, or policy, or crosses to another owner | [ownership.md](references/ownership.md) |
| plans tests for a file | [planning-tests.md](references/planning-tests.md) |
| tests `workflows.go` | [testing-workflows.md](references/testing-workflows.md) |
| tests `activities.go` or `client.go` | [testing-activities.md](references/testing-activities.md) |

Every test also follows [`dev-testing-go`](../dev-testing-go/SKILL.md): its names, tables, mocks, and containers hold here, and the references add only what Temporal changes.
