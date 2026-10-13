---
name: sdlc
description: The software development lifecycle every organization on the Initiative/Epic/Task/Bug ladder shares, and the `sdlc-mapping.md` that binds it. Trigger when setting a repository up for issues, writing or auditing an `sdlc-mapping.md`, or asking how issues, labels, boards, or status work here.
---

## The ladder

| Jira | GitHub | Notes |
|---|---|---|
| **Initiative** | Issue `type: Initiative` | Quarter-scale. Holds Epics; the only parent an Epic takes. Body: one paragraph, linking the [roadmap](../elegance/references/cells/2A-roadmap.md) entry that owns its narrative. |
| **Epic** | Issue `type: Epic` | Weeks. Holds Tasks. |
| **Story / Task** | Issue `type: Task` | Minutes to days. One PR. |
| **Spike** | Issue `type: Task`, titled `Spike: …` | Its deliverable is a decision. |
| **Bug** | Issue `type: Bug` | Same size as Task. |
| **Sub-task** | *none* | A Task wanting children is an Epic. |

Bars come from `elegance`: [3A design](../elegance/references/cells/3A-design.md) for Initiative, [4A plan](../elegance/references/cells/4A-plan.md) for Epic, [5A criteria](../elegance/references/cells/5A-criteria.md) for Task and Bug.

A Task files where its PR lands, unless the Epic's owner keeps it beside the Epic; then its Verification names the repo it runs in.

## Mechanisms

| Mechanism | Carries |
|---|---|
| **Type** | Initiative / Epic / Task / Bug, set org-wide; no others. Outside an organization, the title states it. |
| **Parent / sub-issue** | An Epic's parent, if any, is an Initiative; a Task's or Bug's, an Epic: `gh issue edit N --parent P`, cross-repo within one account. |
| **Dependency** | `blocked by` / `blocking`, what can start today: `gh issue edit N --add-blocked-by M`. |
| **Label** | Four roles, named by the [mapping](#the-mapping): `ready` (see [Ready](#status)), `designed` (a person can read the issue alone and know what will be built), `deviated` and `reached-up` (see [Closing](#closing)). |
| **Board** | A projection of [status](#status), holding only issues that serve its purpose: its `shortDescription`, with its items where that leaves doubt; stages move a card on whichever holds it, which needs the `project` scope. |

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

Work starts only on a Task or Bug in Ready, `gh issue list --search 'label:<ready> no:assignee -is:blocked type:Task,Bug'` with the type in the title outside an organization, or on one assigned to the acting identity.

## Roles

| Role | Takes | Default |
|---|---|---|
| `owner` | an issue's scope, a cross-owner conflict surfaced in the issue itself, and its proposals | its assignee, else its parent's `owner`, else the `lead` |
| `delegator` | a stage's escalation | whoever handed the work over, the user or an agent at a wider scope; else the person who started the work, on whom the run waits |
| `lead` | filing Initiatives and Epics; curating root issues, by the `owner` chain | the user |
| `reviewer` | a PR's review | `CODEOWNERS`, else none |

A **remit** is what a delegator writes when handing work down: the choices the delegate owns. A comment relying on one cites it. A choice is the delegate's when nobody outside its unit has to agree, [`elegance`'s scope test](../elegance/references/scope.md#which-tier-is-this), or when the remit hands it down; otherwise it escalates.

An agent may act, or proposes to the `owner` in a comment:

| Action | Task / Bug | Epic / Initiative |
|---|---|---|
| Type, and labels but `designed` and [`sdlc-intake`](../sdlc-intake/SKILL.md)'s `ready` | may | propose |
| Parent or stated `blocked by` | may | propose |
| Assign, close, edit another's body | propose | propose |

A request to pick an issue up is its `owner`'s yes to assigning.

## Stages

Each stage belongs to a skill. It runs its own checks and the mapping's Checks rows for its stage and paths, then posts one comment, on the PR for a reviewer and on the issue otherwise, unless a filed issue or a label it applies already says it:

```markdown
### <skill> · <Stage>: pass|escalate|stop
- [x] <check>
- [ ] <check>: <what failed>
```

| Ends in | When | Then |
|---|---|---|
| pass | every check holds, a finding applied as written among them | proceed |
| escalate | a choice that is not the delegate's would pass it | the `delegator` takes it, climbing until it reaches an actor whose context covers it |
| stop | there is no way forward | the same climb |

A comment naming a private repository lands only in a private one.

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

`sdlc-mapping.md` binds the lifecycle to an organization; see its [schema](references/mapping.md).

## Setup

Once per repository, before filing there, run `${CLAUDE_PLUGIN_ROOT}/scripts/sdlc-setup.sh OWNER/REPO [PATH | OWNER/NAME:PATH]` and act on each `TODO` it prints; rerunning is safe.

The forms are [forms/](forms/), kept once in the organization's `.github` repository; a repository's own `.github/ISSUE_TEMPLATE/` replaces them whole.
