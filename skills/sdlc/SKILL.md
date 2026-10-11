---
name: sdlc
description: The parts of the software development lifecycle every organization on the Epic/Task/Bug ladder shares, and the `sdlc-mapping.md` each binds them with. Trigger when setting a repository up for issues, when writing or auditing an `sdlc-mapping.md`, and whenever asking how issues, labels, boards, or status work here.
---

## The ladder

| Jira | GitHub | Notes |
|---|---|---|
| **Initiative** | an Effort on the [Roadmap](../elegance/references/grid.md#location-key) | Quarter-scale. **Not** an issue type. |
| **Epic** | Issue `type: Epic` | Weeks. Holds Tasks. |
| **Story / Task** | Issue `type: Task` | Minutes to days. One pass, one diff, one PR. **What agents pick up.** |
| **Spike** | Issue `type: Task`, titled `Spike: …` | Task-sized. Its deliverable is a decision, not a diff. |
| **Bug** | Issue `type: Bug` | Same size as Task. |
| **Sub-task** | *none* | A Task that wants children is an Epic with sibling Tasks. |

Bars and checks come from the `elegance` skill: [4A plan](../elegance/references/cells/4A-plan.md) for Epic, [5A criteria](../elegance/references/cells/5A-criteria.md) for Task, [3A design](../elegance/references/cells/3A-design.md) for Effort.

**Prefer Epic → Task.** Nest Epic under Epic only when one root must group cross-repo epics.

**Self-owned.** Each issue's [`owner`](#roles) decides its scope; surface a genuine cross-owner conflict in the issue itself.

**Repo follows the PR.** A Task files where its PR lands, unless the Epic's owner keeps it beside the Epic; then its Verification names the repo it runs in. The repo is never separate metadata.

## Mechanisms

| Mechanism | Carries |
|---|---|
| **Type** | Epic / Task / Bug, set org-wide; no others. Outside an organization, the title states it. Size lives on Epic vs Task. |
| **Parent / sub-issue** | Composition and rollup, cross-repo within one account: `gh issue edit N --parent P`. |
| **Dependency** | `blocked by` / `blocking`, what can start today: `gh issue edit N --add-blocked-by M`. |
| **Label** | Four roles, under the names the [mapping](#the-mapping) gives them: `ready`, meets its form (see [Ready](#status)); `designed`, its design stage passed; `deviated` and `reached-up`, as in [Closing](#closing). |
| **Board** | A projection of [status](#status), only where the mapping names one; then the stages move its cards, and only then need `read:project`. |

## Status

Derived from GitHub facts alone, never written: `gh issue view N --json issueType,state,stateReason,labels,assignees,blockedBy,closedByPullRequestsReferences,body`. The last row that holds names it.

| Status | Holds when |
|---|---|
| Backlog | open |
| Blocked | open, with an open `blocked by` |
| Ready | open, `ready`, unassigned, no open `blocked by`, and the body carries its form's required fields |
| In progress | open and assigned |
| In review | an open PR closes it |
| Done | closed **completed** |
| Dropped | closed **not planned** |

Work starts only on a Task or Bug in Ready.

## Roles

| Role | Takes | Default |
|---|---|---|
| `owner` | the proposals on an issue | its assignee, else its parent's `owner`, else the `lead` |
| `lead` | a stage's stop | the user |

An agent may act, or proposes the action to the `owner` in a comment:

| Action | Task / Bug | Epic |
|---|---|---|
| Type and labels | may | propose |
| Parent or stated `blocked by` | may | propose |
| Comment | may | may |
| Assign, close, edit another's body | propose | propose |

## Stages

Each stage is a skill. It runs its own checks and the mapping's Checks rows for its stage and the paths it touches, then posts one comment, on the PR for a reviewer and on the issue otherwise, headed by how it ends:

```markdown
### <skill> · <Stage>: pass|pause|stop
- [x] <check>
- [ ] <check>: <what failed>
```

| Ends in | When | Then |
|---|---|---|
| pass | every check holds | proceed |
| pause | minor tweaks would pass it | wait for the user to confirm them |
| stop | the failures are too many or too severe | raise them to the `lead` |

## Closing

| Outcome | Close |
|---|---|
| Done as planned | **completed** |
| Dropped | **not planned** |
| Done differently | **completed** + `deviated` + comment |
| Child needed a parent rewrite | `reached-up` on the Task |
| Spike answered | **completed** + a `Decision:` comment, once the decision is in the body that reads it (usually the parent's: `reached-up`) |

## Linking an issue to its branch and PR

- `Closes #N` / `Fixes #N` in the PR body; `Closes OWNER/REPO#N` when the issue lives in another repo.
- `gh issue develop N --name <branch>`, with the branch name the [`checkin`](../checkin/SKILL.md) skill gives; **`--name` is required**. Add `-R OWNER/REPO --branch-repo OWNER/PR-REPO` when the issue and the PR live apart.

## The mapping

`sdlc-mapping.md` binds the lifecycle to an organization, beside its other mappings. A project may keep its own at its root, linking to the organization's; where both state a row, the project's holds. Its sections are tables:

| Section | Columns | Where absent |
|---|---|---|
| `## Labels` | Role, Label, Description | each [role](#mechanisms) under its own name, described as there |
| `## Repositories` | Repository, Board, Epics | no board; Epics file in the repository itself |
| `## Status` | Status, Column | each column named for its status |
| `## Roles` | Role, Who | the [defaults](#roles) |
| `## Checks` | Stage, Paths, Check | the stage's own checks only |
| `## Cadence` | Threshold, Value | `sweep` every 7 days; `stale` after 14 days without activity; `backlog` after 90 days in Backlog |

- **Hole** marks an undecided cell: report it, never fill it.
- Agents read it whole, within 600 words; no tool but `sdlc-setup.sh` may parse it.
- If the repository has none, ask the user where the organization's is; read a private one with `gh api repos/<owner>/<name>/contents/<path>`.

## Setup

Once per repository, before filing there, run `${CLAUDE_PLUGIN_ROOT}/scripts/sdlc-setup.sh OWNER/REPO` and act on each `TODO` it prints; rerunning is safe.

The forms are [forms/](forms/), kept once in the organization's `.github` repository; a repository's own `.github/ISSUE_TEMPLATE/` replaces them whole.
