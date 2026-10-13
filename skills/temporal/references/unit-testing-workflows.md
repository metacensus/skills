# Unit Testing Workflows

## Workflow Validation Pattern

All workflows follow a **constructor + validate** pattern that separates input validation from workflow execution:

```go
// Constructor validates and creates the workflow
func newXxxWorkflow(input *pb.XxxInput) (*xxxWorkflow, error) {
    w := &xxxWorkflow{input: input}
    if err := w.validate(); err != nil {
        return nil, err
    }
    return w, nil
}

// Validation as a method on the workflow type
func (w *xxxWorkflow) validate() error {
    if w.input.RequiredField == "" {
        return fmt.Errorf("required_field is required")
    }
    return nil
}

// Public method delegates to constructor
func (w *Workflows) Xxx(ctx workflow.Context, input *pb.XxxWorkflowInput) (pb.XxxWorkflow, error) {
    return newXxxWorkflow(input.Req)
}
```

**Benefits:**
- Validation happens before `Execute()` is called
- Constructor tests are fast (no workflow environment needed)
- Execution tests focus purely on orchestration logic
- Clear separation of concerns

---

## Test Organization: Constructor vs Execution Tests

Workflow tests are organized into two categories:

### Constructor Tests (`TestNewXxxWorkflow`)

Test validation logic directly without a workflow environment:

```go
func TestNewCreateNamespaceWorkflow(t *testing.T) {
    tests := []struct {
        name      string
        input     *pb.CreateNamespaceInput
        wantErr   bool
        errSubstr string
    }{
        {
            name:    "success - valid input",
            input:   &pb.CreateNamespaceInput{Org: "org1"},
            wantErr: false,
        },
        {
            name:      "error - empty org",
            input:     &pb.CreateNamespaceInput{Org: ""},
            wantErr:   true,
            errSubstr: "org is required",
        },
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            wf, err := newCreateNamespaceWorkflow(tt.input)

            if tt.wantErr {
                if err == nil {
                    t.Fatal("expected error, got nil")
                }
                if tt.errSubstr != "" && !strings.Contains(err.Error(), tt.errSubstr) {
                    t.Errorf("expected error containing %q, got: %v", tt.errSubstr, err)
                }
                if wf != nil {
                    t.Error("expected nil workflow on error")
                }
            } else {
                if err != nil {
                    t.Fatalf("unexpected error: %v", err)
                }
                if wf == nil {
                    t.Fatal("expected non-nil workflow")
                }
            }
        })
    }
}
```

**Advantages of constructor tests:**
- No workflow environment setup required
- Fast execution (milliseconds)
- Focused on validation logic only
- Easy to add comprehensive edge cases

### Execution Tests (`TestXxxWorkflow_Execute`)

Test orchestration logic with mocked activities and child workflows:

```go
func TestCreateNamespaceWorkflow_Execute(t *testing.T) {
    tests := []struct {
        name          string
        org           string
        renderErr     error
        applyErr      error
        wantErr       bool
        errSubstr     string
        wantNamespace string
    }{
        {
            name:          "success - namespace created",
            org:           "testorg",
            wantErr:       false,
            wantNamespace: "ns-testorg",
        },
        {
            name:      "error - render chart fails",
            org:       "testorg",
            renderErr: errors.New("helm rendering failed"),
            wantErr:   true,
            errSubstr: "render chart",
        },
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            env := (&testsuite.WorkflowTestSuite{}).NewTestWorkflowEnvironment()

            // Register and mock activities...
            // Execute workflow with VALID input (validation tested separately)
            env.ExecuteWorkflow(func(ctx workflow.Context, input *pb.CreateNamespaceInput) (*pb.CreateNamespaceOutput, error) {
                wf, err := workflows.CreateNamespace(ctx, &pb.CreateNamespaceWorkflowInput{Req: input})
                if err != nil {
                    return nil, err
                }
                return wf.Execute(ctx)
            }, &pb.CreateNamespaceInput{Org: tt.org})

            // Verify results...
        })
    }
}
```

**Key principle:** Execution tests use **valid inputs only**. Validation is tested separately in constructor tests.

---

## Guiding Principles for Workflow Tests

### 1. Make Intent Explicit Through Test Names

Each test case name clearly describes **what** is being tested and **why it should work or fail**:

```go
// ✅ Good: intent is crystal clear
{name: "success - orchestrates deployment in correct order"},
{name: "error - fails if child activity times out"},
{name: "error - rolls back on stage 2 failure"},

// ❌ Bad: no information
{name: "test1"},
{name: "error case"},
```

Readers should understand the test purpose without reading the test body.

### 2. Only Mock What You Need to Mock

Mock only the direct dependencies of the workflow (activities and child workflows). This keeps tests focused and prevents brittleness:

```go
// ✅ GOOD: mock only direct dependencies
env.OnActivity("CreateDeployment", mock.Anything, mock.Anything).Return(nil, nil)
env.OnWorkflow("ValidateConfiguration", mock.Anything, mock.Anything).Return(nil)

// ❌ BAD: don't mock the internal structures activities use
env.OnCall(kubeClient.Create).Return(nil)
```

### 3. Each Test Case Is Completely Independent

Tests must not depend on execution order or shared state. Use table-driven tests where each iteration is fresh:

```go
for _, tt := range tests {
    t.Run(tt.name, func(t *testing.T) {
        // Fresh environment for every case
        env := (&testsuite.WorkflowTestSuite{}).NewTestWorkflowEnvironment()
        // ... test setup ...
    })
}
```

### 4. Test Conditional Logic and Branching

Workflows orchestrate complex sequences. Test that branching logic routes execution correctly:

```go
// ✅ Test different paths through the workflow
{name: "skips validation if already validated"},
{name: "rolls back to checkpoint on mid-stage failure"},
{name: "retries failed activities up to limit"},
```

---

## What to Test

### In Constructor Tests
- Required field validation (empty strings, nil values)
- Field format validation (e.g., cert_type must be "tls" or "org")
- Cross-field validation (if field A requires field B)
- All validation error messages are clear

### In Execution Tests
- Happy path succeeds without errors
- Error propagation from child workflows/activities
- Conditional branching logic (if/else branches)
- Correct activities/workflows invoked in correct order
- Retry logic and backoff behavior
- Proper cleanup/rollback on failure

**Note:** Do NOT test validation in execution tests — that's what constructor tests are for.

---

## Implementation Checklist: Workflow Unit Tests

### Constructor Tests (`TestNewXxxWorkflow`)
- [ ] Test valid input succeeds (returns workflow, no error)
- [ ] Test each required field validation (empty/nil returns error)
- [ ] Test field format validation (e.g., enum values)
- [ ] Verify error messages are clear and actionable
- [ ] No workflow environment needed — direct function call

### Execution Tests (`TestXxxWorkflow_Execute`)
- [ ] Test happy path succeeds (use valid input only)
- [ ] Test error paths (child workflow/activity failures)
- [ ] Test branching logic (if/else paths)
- [ ] Test retry logic and backoff
- [ ] Test child workflows/activities are called with correct inputs
- [ ] Mock all child workflows and activities
- [ ] Use descriptive test case names showing the flow
- [ ] Ensure each test case is completely independent
- [ ] Verify outputs match expectations

---

## Why Workflow Tests Are Critical

**Workflows must be deterministic to support replay.** Temporal uses event history to replay workflows:

1. Original execution: "Execute activity A, then B, then C"
2. Activity B fails, crashes, you deploy new code
3. Temporal replays: "Execute A (from cache), then B (retry)"
4. New code must execute activities in same order, or replay breaks

**Unit tests validate this invariant** by ensuring:
- Activities always execute in the same order
- Branching logic is deterministic (same input → same output)
- No random behavior affects orchestration order

What keeps a workflow deterministic:
- I/O lives in activities; the workflow only orchestrates.
- Time, randomness, and concurrency come from `workflow`: `Now`, `Sleep`, `SideEffect`, `Go`, its channels and selectors; never `time`, `rand`, `go`, `chan`, or `select`, and no command order depends on map iteration.
- A change to which commands run, or their order, ships behind `workflow.GetVersion`, so histories already running replay down their old branch.

---

## Replay Tests

Unit tests and replay tests prove different things:

| | Unit test | Replay test |
|---|---|---|
| Proves | today's code orchestrates correctly | today's code accepts the histories yesterday's code wrote |
| Starts from | a fresh execution, mocked dependencies | a recorded event history |
| Fails when | the orchestration is wrong | a change breaks determinism for executions already running |
| Lives in | `workflows_test.go` | `workflows_replay_test.go` |

A unit test cannot catch nondeterminism across deploys: it starts fresh, so no history constrains it.

- **Histories live in `testdata/replay/<Workflow>/<case>.json`**, exported from a real run with `temporal workflow show --workflow-id <id> --output json`.
- **One subtest per history**: `worker.NewWorkflowReplayer()`, register the workflow, then `ReplayWorkflowHistoryFromJSONFile`; a nondeterminism error fails it.
- **A history is added when a workflow ships**, and kept while executions of it can still be running.

---

## References

- **[pfi-pattern.md](pfi-pattern.md)** — PFI layout and registration
- **[unit-testing.md](unit-testing.md)** — Testing overview
- **[unit-testing-activities.md](unit-testing-activities.md)** — Activity testing
- **[integration-testing.md](integration-testing.md)** — Integration testing
