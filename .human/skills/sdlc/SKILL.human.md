> Every organization on the Initiative / Epic / Task / Bug ladder shares one lifecycle; its `sdlc-mapping.md` binds it ([mapping](references/mapping.human.md)).

Fires: setting a repository up for issues, writing or auditing an `sdlc-mapping.md`, asking how issues, labels, boards, or status work here. Setup runs once per repository, first.

```
Backlog → Ready → In progress → In review → Done
   ↘ Blocked   (open `blocked by`; back when it clears)
   ↘ Dropped   (closed not planned)
```

## The ladder

```
Initiative ⊃ Epic ⊃ Task | Spike | Bug      (no Sub-task: a Task wanting children is an Epic)
```

| Jira | GitHub | Size | Bar |
|---|---|---|---|
| Initiative | `type: Initiative` | quarter | 3A design |
| Epic | `type: Epic` | weeks | 4A plan |
| Story / Task | `type: Task` | minutes to days, one PR | 5A criteria |
| Spike | `type: Task`, titled `Spike: …` | a decision | 5A criteria |
| Bug | `type: Bug` | as a Task | 5A criteria |
| Sub-task | · | · | · |

- Bars come from `elegance`.
- A Task files where its PR lands; kept beside its Epic instead, its Verification names the repo it runs in.

## Mechanisms

| Mechanism | Carries |
|---|---|
| Type | Initiative / Epic / Task / Bug, org-wide, no others; outside an org, the title says it |
| Parent / sub-issue | Epic → Initiative; Task or Bug → Epic: `gh issue edit N --parent P` |
| Dependency | `blocked by` / `blocking`: `gh issue edit N --add-blocked-by M` |
| Label | `ready` ([Status](#status)), `designed` (readable alone), `deviated`, `reached-up` ([Closing](#closing)); names set by the [mapping](references/mapping.human.md) |
| Board | a projection of [Status](#status) and Priority; per-type views, Status columns by Priority rows, Auto-add sub-issues ([Setup](#setup)); writing needs the `project` scope |
| Priority | org issue field. People set it on Initiatives and on issues differing from their parent; blank inherits the parent's, raised to the highest open issue it blocks. The mapping's Priority rows give meanings per board |

- ⚠️ Later-stage work: an Initiative held for a later stage holds only work that waits for it, its body one paragraph linking its roadmap entry (`elegance`). It sits at lowest Priority until `--reset` re-ranks it.

## Status

```
node ${CLAUDE_PLUGIN_ROOT}/scripts/sdlc-status.mts OWNER/N | OWNER/REPO#N... --mapping PATH [--apply] [--reset]
```

- Prints status, Priority, Initiative; `ready` is taken as curated.
- `--apply` moves cards, archives one with no column, fills a blank Priority.
- `--reset` makes everything under the named issues inherit again.

| Status | Holds when | Moved by |
|---|---|---|
| Backlog | open | person, filing |
| Blocked | open, an open `blocked by` | dependency |
| Ready | open, `ready`, unassigned, no open `blocked by`, required fields in the body | person, the label |
| In progress | open, assigned; Initiative or Epic also once a child is In progress, In review, or Done | person, assigning; children |
| In review | an open PR closes it | PR |
| Done | closed **completed** | person, closing; PR merge |
| Dropped | closed **not planned** | person, closing |

- Work starts on a Task or Bug in Ready, highest Priority first, or on one assigned to the acting identity.
- Query: `gh issue list --search 'label:<ready> no:assignee -is:blocked type:Task,Bug'`.

## Roles

| Role | Takes | Default |
|---|---|---|
| `delegator` | what the delegate cannot own: a stage's escalation or stop, filing an Initiative or Epic, a root issue | whoever handed the work over; else the person who started it |
| `reviewer` | a PR's review | `CODEOWNERS`, else none |

- A **remit** is the choices a delegator hands down; a comment relying on one cites it.
- A choice is the delegate's when nobody outside its unit must agree (`elegance` scope test) or a remit hands it down; else ⛔.

| Delegate verb | For |
|---|---|
| ⛔ escalate | a choice it cannot own |
| consult | a person, on a question whose choice stays its own |
| report | what the delegator should know and need not answer |

- A delegator may steer, halt, or query unprompted.
- Going up carries the choice, options, and a recommendation, never the work behind them.

Agent action: ✅ may · ⛔ escalate, in a comment.

| Action | Task / Bug | Epic / Initiative |
|---|---|---|
| Type; labels but `designed` and `sdlc-intake`'s `ready` | ✅ | ⛔ |
| Parent or stated `blocked by` | ✅ | ⛔ |
| Close an issue it carries, completed as planned | ✅ | ✅ |
| Assign; close another's issue or edit its body | ⛔ | ⛔ |

- A request to pick an issue up is the delegator's yes to assigning.

## Stages

Each stage's skill runs its checks and the mapping's Checks rows, then posts one comment (PR for a reviewer, issue otherwise) unless an issue or label already says it.

```markdown
### <skill> · <Stage>: pass|escalate|stop
- [x] <check>
- [ ] <check>: <what failed>
```

| Ends in | When | Then |
|---|---|---|
| pass | every check holds, findings applied as written | proceed |
| escalate | a choice not the delegate's would pass | `delegator` takes it, climbing to an actor whose context covers it |
| stop | no way forward | same climb |

- ⚠️ A comment naming a private repository lands only in a private one.

## Closing

| Outcome | Close | Escalates |
|---|---|---|
| Done as planned | **completed** | · |
| Done differently | **completed** + `deviated` + comment | ⛔ |
| Child needed a parent rewrite | `reached-up` on the Task | · |
| Spike answered | **completed** + `Decision:` comment, once in the body that reads it (usually the parent's: `reached-up`) | · |
| Not planned | **not planned** | ⛔ |

## Linking an issue to its branch and PR

- `Closes #N` in the PR body; `Closes OWNER/REPO#N` across repositories.
- `gh issue develop N --name <branch>` at Publish, before the push, under `checkin`'s name; `--name` is required.
- Skip it when the branch exists or it cannot run; `Closes #N` carries.
- Issue and PR in different repos: add `-R OWNER/REPO --branch-repo OWNER/PR-REPO`.

## The mapping

`sdlc-mapping.md` binds the lifecycle to an organization: [schema](references/mapping.human.md).

## Setup

- Once per repository, before filing: `${CLAUDE_PLUGIN_ROOT}/scripts/sdlc-setup.sh OWNER/REPO [PATH | OWNER/NAME:PATH]`; act on each `TODO`; rerunning is safe.
- Forms (`forms/`) live once in the organization's `.github` repository; a repository's own `.github/ISSUE_TEMPLATE/` replaces them whole.
