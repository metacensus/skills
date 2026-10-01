---
name: issues
description: The issue ladder — how work is typed (Epic/Task/Bug), composed, filed, picked up, and closed on GitHub across an organization's repositories. Trigger whenever filing, triaging, composing, picking up, reviewing, or closing an issue, and whenever asking what work is ready to start.
---

## Jira → GitHub (minimal)

| Jira | GitHub | Notes |
|---|---|---|
| **Initiative** | an Effort on the [Roadmap](../elegance/references/grid.md#location-key) | Quarter-scale. **Not** an issue type. |
| **Epic** | Issue `type: Epic` | Weeks. Holds Tasks. |
| **Story / Task** | Issue `type: Task` | Minutes to days. One pass, one diff, one PR. **What agents pick up.** |
| **Bug** | Issue `type: Bug` | Same size as Task. |
| **Sub-task** | *none* | A Task that wants children is an Epic with sibling Tasks. |

Bars and checks come from the `elegance` skill: [4A plan](../elegance/references/cells/4A-plan.md) for Epic, [5A criteria](../elegance/references/cells/5A-criteria.md) for Task, [3A design](../elegance/references/cells/3A-design.md) for Effort.

**Prefer Epic → Task.** Nest Epic under Epic only when one root must group cross-repo epics.

**Self-owned.** Each issue's assignee decides its scope; there is no separate decider role and no decide-by date. Surface a genuine cross-owner conflict in the issue itself.

**Repo is implicit.** A Task lands in its Epic's repo unless its PR lands elsewhere; it is never separate metadata.

## Mechanisms (GitHub's words)

| Word | Carries |
|---|---|
| **Type** | Epic / Task / Bug, set org-wide. Size lives on Epic vs Task. |
| **Parent / sub-issue** | Composition and rollup. Cross-repo under one owner. |
| **Dependency** | `blocked by` / `blocking` — what can start today. |
| **Label** | Two roles and nothing else: intake (`needs-triage`, `agent-ready`) and drift (`deviated`, `reached-up`). |

No milestones. Status is derived: open/closed, assignee, linked PR, sub-issue rollup, close reason. A Project board is optional for humans; agents never need `read:project`.

Where a repository lacks a mechanism, state type and parent in the body, and judge readiness by reading it.

## Filing

One issue form per type, blank issues off, and every form applies `needs-triage`. The forms carry this convention inline.

- **Epic** requires goal and non-goals. Children are the linked sub-issues, never a body list.
- **Task** requires goal, binary acceptance criteria, and a **Verification** command whose exit code settles done.
- **Bug** requires observed and expected; verification optional.

Leads file Epics; engineers file Tasks under them.

## Picking up work

A Task is **ready** when it is open, labeled `agent-ready` and not `needs-triage`, unassigned, has no open `blocked by` (`gh issue view N --json issueDependencies`), and its body carries criteria and verification. If any fails, comment and do not start.

| Action | Task / Bug | Epic |
|---|---|---|
| Type and intake labels | may | propose |
| Parent or stated `blocked by` | may | propose |
| Comment | may | may |
| Assign, close, edit others' body | propose | propose |

## Closing

| Outcome | Close |
|---|---|
| Done as planned | **completed** |
| Dropped | **not planned** |
| Done differently | **completed** + `deviated` + comment |
| Child needed a parent rewrite | `reached-up` on the Task |

## Linking an issue to its branch and PR

- `Closes #N` / `Fixes #N` in the PR body.
- `gh issue develop ISSUE --name <branch>`, with the branch name the [`checkin`](../checkin/SKILL.md) skill gives; **`--name` is required**.
