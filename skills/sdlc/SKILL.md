---
name: sdlc
description: The software development lifecycle every organization on the Epic/Task/Bug ladder shares, and the `sdlc-mapping.md` that binds it. Trigger when setting a repository up for issues, writing or auditing an `sdlc-mapping.md`, or asking how issues, labels, boards, or status work here.
---

## The ladder

| Jira | GitHub | Notes |
|---|---|---|
| **Initiative** | an Effort on the [Roadmap](../elegance/references/grid.md#location-key) | Quarter-scale. **Not** an issue type. |
| **Epic** | Issue `type: Epic` | Weeks. Holds Tasks. |
| **Story / Task** | Issue `type: Task` | Minutes to days. One PR. |
| **Spike** | Issue `type: Task`, titled `Spike: …` | Its deliverable is a decision. |
| **Bug** | Issue `type: Bug` | Same size as Task. |
| **Sub-task** | *none* | A Task wanting children is an Epic. |

Bars come from `elegance`: [4A plan](../elegance/references/cells/4A-plan.md) for Epic, [5A criteria](../elegance/references/cells/5A-criteria.md) for Task and Bug, [3A design](../elegance/references/cells/3A-design.md) for Effort.

**Nest Epic under Epic** only when one root must group cross-repo epics.

**Repo follows the PR.** A Task files where its PR lands, unless the Epic's owner keeps it beside the Epic; then its Verification names the repo it runs in.

## Mechanisms

| Mechanism | Carries |
|---|---|
| **Type** | Epic / Task / Bug, set org-wide; no others. Outside an organization, the title states it. |
| **Parent / sub-issue** | Composition and rollup, cross-repo within one account: `gh issue edit N --parent P`. |
| **Dependency** | `blocked by` / `blocking`, what can start today: `gh issue edit N --add-blocked-by M`. |
| **Label** | Four roles, named by the [mapping](#the-mapping): `ready` (see [Ready](#status)), `designed` (a person can read the issue alone and know what will be built: its body, and any further design in the Design comment), `deviated` and `reached-up` (see [Closing](#closing)). |
| **Board** | A projection of [status](#status), only where the mapping names boards; stages move a card on whichever holds it, which needs the `project` scope. |

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

Work starts only on a Task or Bug in Ready, `gh issue list --search 'label:<ready> no:assignee -is:blocked type:Task,Bug'` with the type in the title outside an organization, or on one assigned to the acting identity. Pickup claims it by assigning that identity.

## Roles

| Role | Takes | Default |
|---|---|---|
| `owner` | an issue's scope, a cross-owner conflict surfaced in the issue itself, and its proposals | its assignee, else its parent's `owner`, else the `lead` |
| `lead` | a stage's stop; filing Epics; curating root issues, by the `owner` chain | the user |
| `reviewer` | a PR's review | `CODEOWNERS`, else none |

An agent may act, or proposes to the `owner` in a comment:

| Action | Task / Bug | Epic |
|---|---|---|
| Type, and labels but `designed` and [`sdlc-intake`](../sdlc-intake/SKILL.md)'s `ready` | may | propose |
| Parent or stated `blocked by` | may | propose |
| Assign, close, edit another's body | propose | propose |

A request to pick an issue up is its `owner`'s yes to assigning.

## Stages

Each stage belongs to a skill. It runs its own checks and the mapping's Checks rows for its stage and paths, then posts one comment, on the PR for a reviewer and on the issue otherwise, unless what it leaves on GitHub, a filed issue or an applied label, already says it:

```markdown
### <skill> · <Stage>: pass|pause|stop
- [x] <check>
- [ ] <check>: <what failed>
```

| Ends in | When | Then |
|---|---|---|
| pass | every check holds | proceed |
| pause | minor tweaks would pass it | wait for the user to confirm them; when delegated, also carry them into the PR body as a decision before merge, and continue if the branch was handed over |
| stop | the failures are too many or too severe | raise them to the `lead` |

## Closing

| Outcome | Close |
|---|---|
| Done differently | **completed** + `deviated` + comment |
| Child needed a parent rewrite | `reached-up` on the Task |
| Spike answered | **completed** + a `Decision:` comment, once the decision is in the body that reads it (usually the parent's: `reached-up`) |

## Linking an issue to its branch and PR

- `Closes #N` in the PR body, `Closes OWNER/REPO#N` across repositories.
- `gh issue develop N --name <branch>`, under [`checkin`](../checkin/SKILL.md)'s name, at Publish before the push: it creates the remote branch. When one already exists, or it cannot run, skip it and rely on `Closes #N`. **`--name` is required**. Add `-R OWNER/REPO --branch-repo OWNER/PR-REPO` when the issue and the PR live apart.

## The mapping

`sdlc-mapping.md` binds the lifecycle to an organization, beside its other mappings. A project may keep its own at its root, read first, the organization's filling what it lacks. Its sections are tables, defaulting per row:

| Section | Columns | Where absent |
|---|---|---|
| `## Labels` | Role, Label, Description | each [role](#mechanisms) under its own name, described as there |
| `## Repositories` | Repository as `OWNER/REPO`, Board as space-separated `OWNER/N`, Epics | no board; Epics file in the repository itself |
| `## Status` | Status, Column (`—`: no card move) | each column named for its status |
| `## Roles` | Role, Who | the [defaults](#roles) |
| `## Checks` | Stage, Paths, Check | the stage's own checks only |
| `## Cadence` | Threshold, Value | `sweep` every 7 days; `stale` after 14 days without activity; `backlog` after 90 days in Backlog |

- A cell containing `Hole` is undecided: its row takes the default, and it is reported, never filled. `—` is an empty cell.
- Agents read both whole, within 600 words each; no tool but `sdlc-setup.sh`, which takes one, may parse them.
- If the repository has none, ask the user where the organization's is; read a private one with `gh api repos/<owner>/<name>/contents/<path>`.

## Setup

Once per repository, before filing there, run `${CLAUDE_PLUGIN_ROOT}/scripts/sdlc-setup.sh OWNER/REPO [PATH | OWNER/NAME:PATH]` and act on each `TODO` it prints; rerunning is safe.

The forms are [forms/](forms/), kept once in the organization's `.github` repository; a repository's own `.github/ISSUE_TEMPLATE/` replaces them whole.
