---
name: issues
description: The issue ladder (Epic/Task/Bug) on GitHub across an organization's repositories. Trigger whenever filing, triaging, composing, picking up, reviewing, or closing an issue, whenever asking what work is ready to start, and whenever a repository's issues are not yet set up for it.
---

## Jira → GitHub (minimal)

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

**Self-owned.** Each issue's assignee decides its scope; there is no separate decider role and no decide-by date. Surface a genuine cross-owner conflict in the issue itself.

**Repo follows the PR.** A Task files where its PR lands, unless the Epic's owner keeps it beside the Epic; then its Verification names the repo it runs in. The repo is never separate metadata.

## Mechanisms (GitHub's words)

| Word | Carries |
|---|---|
| **Type** | Epic / Task / Bug, set org-wide; no others. Outside an organization, the title states it. Size lives on Epic vs Task. |
| **Parent / sub-issue** | Composition and rollup. Cross-repo under one owner. |
| **Dependency** | `blocked by` / `blocking` — what can start today. |
| **Label** | Two roles and nothing else: intake (`needs-triage`, `agent-ready`) and drift (`deviated`, `reached-up`). |

No milestones. Status is derived: open/closed, assignee, linked PR, sub-issue rollup, close reason. A Project board is optional for humans; agents never need `read:project`.

## Setup

Once per repository, before filing there, run `${CLAUDE_PLUGIN_ROOT}/scripts/issues-setup.sh OWNER/REPO` and act on each `TODO` it prints; rerunning is safe.

The forms are [forms/](forms/), kept once in the organization's `.github` repository; a repository's own `.github/ISSUE_TEMPLATE/` replaces them whole.

## Filing

Set the parent after filing (`gh issue edit N --parent P`), or file from the CLI with `gh issue create --type T --parent P --label needs-triage`.

Leads file Epics; engineers file Tasks under them.

## Triage

The parent Epic's assignee triages its children; a lead triages root issues. Triage checks type, parent, and the form's required fields, then swaps `needs-triage` for `agent-ready`, or comments what is missing and leaves it.

## Picking up work

A Task is **ready** when it is open, labeled `agent-ready` and not `needs-triage`, unassigned, has no open `blocked by` (`gh issue view N --json blockedBy`), and its body carries its form's required fields. If any fails, comment and do not start.

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
| Spike answered | **completed** + a `Decision:` comment, once the decision is in the body that reads it (usually the parent's: `reached-up`) |

## Linking an issue to its branch and PR

- `Closes #N` / `Fixes #N` in the PR body; `Closes OWNER/REPO#N` when the issue lives in another repo.
- `gh issue develop N --name <branch>`, with the branch name the [`checkin`](../checkin/SKILL.md) skill gives; **`--name` is required**. Add `-R OWNER/REPO --branch-repo OWNER/PR-REPO` when the issue and the PR live apart.
