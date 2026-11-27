---
name: sdlc
description: The issue lifecycle on the Initiative/Epic/Task/Bug ladder, and the `sdlc-mapping.md` that binds it. Trigger when setting a repository up for issues, writing or auditing an `sdlc-mapping.md`, asking how issues, labels, boards or status work or whether an issue is ready, reporting up to a person, and handing work to a fresh session or writing its prompt.
---

## The ladder

| Jira | GitHub | Notes |
|---|---|---|
| **Initiative** | Issue `type: Initiative` | A finish line: one outcome. Holds the Epics that exist for it, two or more by preference; the only parent an Epic takes. One held for a later stage holds only work that waits for it. Body: [its form](forms/initiative.yml). |
| **Epic** | Issue `type: Epic` | Weeks. Holds Tasks. |
| **Story / Task** | Issue `type: Task` | Minutes to days. One PR. |
| **Spike** | Issue `type: Task`, titled `Spike: …` | Its deliverable is a decision. |
| **Bug** | Issue `type: Bug` | Same size as Task. |
| **Publish** · **Release** · **Rollout** | Issue `type: Publish`, `Release`, `Rollout` | Production: one version out, one change to production, Releases in order. [production](references/production.md). |
| **Sub-task** | *none* | A Task wanting children is an Epic. |

Bars come from `elegance`: [3A design](../elegance/references/cells/3A-design.md) for Initiative, [4A plan](../elegance/references/cells/4A-plan.md) for Epic, [5A criteria](../elegance/references/cells/5A-criteria.md) for Task and Bug.

A Task files where its PR lands, unless whoever carries the Epic keeps it beside the Epic; then its Verification names the repo it runs in. An Epic files where most of its work lands; an Initiative, where its delegator names, else the home the mapping suggests.

## Mechanisms

| Mechanism | Carries |
|---|---|
| **Type** | Initiative / Epic / Task / Bug, and Publish / Release / Rollout, set org-wide; no others. Outside an organization, the title states it. |
| **Parent / sub-issue** | An Epic's parent, if any, is an Initiative; a Task's or Bug's, an Epic: `gh issue edit N --parent P`, cross-repo within one account. |
| **Dependency** | `blocked by` / `blocking`: the issue cannot start while its blocker is open, `gh issue edit N --add-blocked-by M`. A wait to finish is never linked; it is checked where the issue closes. An agent reads a blocker typed Publish, Release or Rollout by title and state alone, and never walks its blockers. |
| **Production** | Work relates to a Publish, Release or Rollout by `blocked by` alone, as [production](references/production.md) says: read it when work ships in, adopts, or is blocked by one. |
| **Label** | Three roles, named by the [mapping](#the-mapping): `ready` (see [Ready](#status)), `designed` (a person can read the issue alone and know what will be built) and `deviated` (see [Closing](#closing)). |
| **Board** | A projection of [status](#status) and Priority, per the mapping's Boards rows, the default board holding the rest; [Setup](#setup) builds it. Writing to it needs the `project` scope. |
| **Priority** | The organization's Priority issue field, on the issue. People set it on Initiatives and on any issue that differs from its parent; a blank one inherits its parent's, raised to the highest of the open issues it blocks, a Publish, Release or Rollout aside. The mapping's Priority rows say what each value means on each board; work held for a later stage sits at its lowest until `--reset` re-ranks it. |

## Status

Derived from GitHub facts alone by `node ${CLAUDE_PLUGIN_ROOT}/scripts/sdlc-status.mts OWNER/N | OWNER/REPO#N... --mapping PATH`, which prints each issue's status, taking `ready` as curated, its Priority and its Initiative; `--apply` moves its cards, archives one whose status has no column, and fills a blank Priority or [inherited field](references/mapping.md); `--reset` makes everything under the issues it names inherit Priority again, which is how a subtree is re-ranked. The last row that holds names it.

| Status | Holds when |
|---|---|
| Backlog | open |
| Blocked | open, with an open `blocked by` |
| Ready | open, `ready`, unassigned, no open `blocked by`, and the body carries its form's required fields |
| In progress | open and assigned; a parent, also once a child is In progress, In review or Done |
| In review | an open PR closes it |
| Done | closed **completed** |
| Dropped | closed **not planned** |

Work starts only on a Task or Bug in Ready, highest Priority first, `gh issue list --search 'label:<ready> no:assignee -is:blocked type:Task,Bug'` with the type in the title outside an organization, or on one assigned to the acting identity.

## Roles

| Role | Takes | Default |
|---|---|---|
| `delegator` | what the delegate cannot own: a stage's escalation or stop, filing an Initiative or Epic, a root issue | whoever handed the work over, the user or an agent at a wider scope; else the person who started the work, on whom the run waits |
| `reviewer` | a PR's review | `CODEOWNERS`, else none |

A **remit** is what a delegator writes when handing work down: the choices the delegate owns. A comment relying on one cites it. Each grant it carries names the exact action and its target, "merge PR #N into main" or "push tag vX.Y.Z to OWNER/REPO", and says when it is standing: a permission check weighs a delegate's calls against that delegate's own brief, so a grant naming only a verb clears nothing, and a grant covers one action unless it says otherwise. A choice is the delegate's when nobody outside its unit has to agree, [`elegance`'s scope test](../elegance/references/scope.md#which-tier-is-this), or when the remit hands it down; otherwise it escalates. Changing how the plan is carried out stays with the delegate; changing the plan escalates one tier, to a person only where that tier is theirs or the change settles a stop. Deferring scope is a person's word; inside its remit an agent decides reversible operational calls itself, neither deferring nor escalating them.

A remit hands choices down short of its **stops**, the kinds of choice, or the issues by name, that escalate however much else it hands over. Unless the remit names its own, they are a fact only a person knows, canon or ontology, policy, a message to others, a choice its giver decided, and closing an Initiative. `designed` is applied by the issue's delegator, never by the agent whose Design proposed it.

A delegate **escalates** a choice it cannot own, **consults** a person on a question whose choice stays its own, and **reports** what its delegator should know and need not answer. A delegator may **steer**, **halt** or **query** its delegate unprompted.

What goes up is sized to the receiver's scope: the choice, its options and a recommendation, never the work behind them. To a person it goes as [Reporting](#reporting) says.

An agent acts, or escalates in a comment:

| Action | Task / Bug | Epic / Initiative |
|---|---|---|
| Type, and labels but [`ready` and `designed`](#phases) | may | escalate |
| Parent or stated `blocked by` | may | escalate |
| Close an issue it carries, completed as planned | may | may |
| Assign; close another's issue or edit its body | escalate | escalate |

A request to pick an issue up is the delegator's yes to assigning.

## Handoff

A session that holds none of its delegator's context, a fresh chat, an Epic's crew, an Initiative's delegator, starts from a [handoff](references/handoff.md).

## Reporting

**A person's attention is spent once per item.** What goes up to a person — an escalation, a consult, a report — names each item once, in the turn it arises or changes. A later turn repeats nothing unchanged, no rolling "still for you" or "still to do", and a notice that changes nothing for the person gets no reply line.

**The status outline** goes out only when the person asks for status, or when all work waits on them. Their queue leads it, their acts alone, ordered by what each unblocks; the rest is the product's state, never the orchestration's: no agent names, PR churn or process narration.

A decision made in chat is recorded on its issue the same turn.

[`human-output`](../human-output/SKILL.md) gives each item, and the outline, its shape.

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

## Phases

Every tier runs three phases. Its delegator frames and accepts; the skill that carries the tier, its carrier, designs, works and reviews, in [stages](#stages) of its own. The steps mirror around the work, and nobody confirms their own:

| Phase | Step | Whose | Asks | Answered by |
|---|---|---|---|---|
| **Design** | Frame | `delegator` | what is the problem? | `ready` |
| | Design | the carrier | what is the plan? | `designed`, applied by the `delegator` |
| **Delivery** | Work | the carrier | · | a PR, or the children closed |
| | Review | the carrier | did we follow the plan? | a cold reviewer's verdict, and `deviated` |
| **Record** | Accept | `delegator` | did we solve the problem? | the close kept or reopened |

Each step hands on, in turn, the issue, the Design, the PR or the children, and the record. Two steps send work back: a Review finding to Work, and a miss at Accept, reopening the issue, to Design.

Design meets the bar [the ladder](#the-ladder) names; an Epic's or Initiative's Delivery is its children's whole lifecycle; Delivery ends in a delivery record, which Accept reads: what landed and where it left the plan, in [4C](../elegance/references/cells/4C-merges.md), or [3C](../elegance/references/cells/3C-release.md) for an Initiative.

**Frame** checks an issue's body before it is `ready`: its type, parent and repository as [the ladder](#the-ladder) and [Mechanisms](#mechanisms) say; its [form](forms/)'s required fields; the bar its type takes, a Spike's decision standing as its criterion; the problem first, with its evidence, naming a solution only where one is decided or is itself the constraint; no emojis, nothing its evidence does not supply, and no line breaks inside a paragraph; and everything that must hold before an [irreversible step](../../agents/code-review.md), each its own criterion. On a pass the `delegator`, or a delegate whose [remit](#roles) names it, applies `ready`, with `designed` when the body settles every choice and none is a [stop](#roles), then [`sdlc-status --apply`](#status); anyone else escalates the pass. A parent's children are framed only once all are filed, so Frame reads the whole set.

**Accept** checks a closed issue against its frame: its Goal, criteria and Non-goals observed where the work now lives, on the default branch or the version released, and its record read for deviations and what was accepted unchecked; never its diff, which review read. A miss reopens the issue with `ready` and without `designed`, naming what is unmet. It follows the close, except where closing is one of the remit's [stops](#roles): an Initiative's, and any issue the stops name.

| Tier | Frames and accepts | Carrier |
|---|---|---|
| Task, Bug | [`sdlc-crew`](../sdlc-crew/SKILL.md#delegate), else a person | [`sdlc-author`](../sdlc-author/SKILL.md) |
| Epic | [`sdlc-fleet`](../sdlc-fleet/SKILL.md#delegate), else a person | [`sdlc-crew`](../sdlc-crew/SKILL.md) |
| Initiative | a person | [`sdlc-fleet`](../sdlc-fleet/SKILL.md) |

A production tier runs Plan, Change and Verify instead, as [production](references/production.md#phases) says.

A Spike is design work carved into a Task, at any tier: its answer is confirmed by the parent's delegator, the `designed` gate one tier up, and Accept checks it. `sdlc-review` and [`sdlc-hygiene`](../sdlc-hygiene/SKILL.md) are drift checks on triggers of their own, not phases.

## Closing

| Outcome | Close |
|---|---|
| Done as planned | **completed** |
| Done differently | **completed** + `deviated`, from the review's verdict, which names how; without a PR, from whoever closes it |
| Spike answered | **completed** + a `Decision:` comment, once its parent's delegator confirms the answer and it is in the body that reads it |

Completion is not deviation: a plain **completed** closes with no escalation. The issue holds the problem and its Design the solution, so a Design settling what the body left open is no deviation; contradicting the body, or settling a [stop](#roles), is. `deviated` and **not planned** escalate to the `delegator`.

## Linking an issue to its branch and PR

- `Closes #N` in the PR body, `Closes OWNER/REPO#N` across repositories.
- `gh issue develop N --name <branch>`, under the name [`sdlc-author`'s Implement](../sdlc-author/SKILL.md#implement) gives, at its [Open](../sdlc-author/SKILL.md#open) before the push: it creates the remote branch. When one already exists, or it cannot run, skip it and rely on `Closes #N`. **`--name` is required**. Add `-R OWNER/REPO --branch-repo OWNER/PR-REPO` when the issue and the PR live apart.

## The mapping

`sdlc-mapping.md` binds the lifecycle to an organization; see its [schema](references/mapping.md).

## Setup

Once per repository, before filing there, [Setup](references/setup.md) runs.
