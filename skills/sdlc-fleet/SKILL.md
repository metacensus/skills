---
name: sdlc-fleet
description: Carry an Initiative from its outline to its finish line with a crew per Epic. Trigger when outlining, filing, running, orchestrating or closing an Initiative, when asking what an Initiative's orchestrator does next, and when its person will be away while it runs.
---

The orchestrator's stages, each run as [the hub's protocol](../sdlc/SKILL.md#stages) says, their comments on the Initiative. One orchestrator session carries one Initiative and no Epic or Task, nor any Publish, Release or Rollout: it stops at the `blocked by` edge to one and reads only whether it has closed, never surveying, cutting or applying; it is every crew's [`delegator`](../sdlc/SKILL.md#roles), and a person is its own. It composes the sdlc flows and [`parallelize`](../parallelize/SKILL.md), starts from a [handoff](../sdlc/references/handoff.md), and while a thread waits on a person, or the person is away, runs [`sdlc-crew`'s Waiting on a person](../sdlc-crew/references/waiting.md). Orchestrators of parallel Initiatives coordinate only through `blocked by` edges and the board.

## Context

The Initiative's body is [its form](../sdlc/forms/initiative.yml)'s fields, which every Epic and Task reaches through its parent: its Roadmap entry, Goal, Non-goals, Decided, Stops, Measures and Owed. A crew's handoff links the Initiative's Decided and Stops, never copies them; a child needing more context means the Initiative is unclear.

## Precheck

- The Initiative is framed by the person: open, `ready`, its body carrying its form's required fields.
- The roadmap entry it advances, and the smallest finish line that moves it.

**Escalate** an Initiative not yet framed, and a finish line or non-goal the person has not stated. **Stop** on an Initiative closed, or when no roadmap entry owns it.

## Design

- One [`human-output`](../human-output/SKILL.md) outline: Initiative → Epics → known Tasks and Spikes; new, existing and moving marked; blockers on their lines.
- An open question holds only the children it rules on, an Epic holding only its Spike where it rules on the whole Epic; the rest file and proceed on its recommended direction, recorded on the issue as `Decided, reversible:`.
- [`design-check`](../../agents/design-check.md) has read each existing Epic it would adopt.
- Once the person approves the outline, they apply `designed`, and each item files per [`sdlc-capture`'s File](../sdlc-capture/SKILL.md#file), against [3A design](../elegance/references/cells/3A-design.md), blockers first, the Initiative's body filled per [Context](#context).

**Escalate** the outline; nothing files before the person approves it. **Stop** when a required field is still a hole.

## Plan

`parallelize` answered: units are the Epics whose [blockers](../sdlc/SKILL.md#mechanisms) are closed; edges their `blocked by` and the contracts they share; the action is [`sdlc-crew`](../sdlc-crew/SKILL.md).

- Overlap is checked at each scope's own grain and no finer, as [`sdlc-crew`'s write-sets](../sdlc-crew/SKILL.md#plan) are at theirs: an author's, functions; a crew's, the files and packages its children's write-sets touch; the fleet's, areas and repositories across Epics; a campaign's, environments and assets.
- Before a wave, the areas and repositories its Epics touch are read, renamed names and the workflows naming them grepped; two Epics touching one area take a `blocked by` edge or a split Task.
- Before a wave, open Releases In progress whose Deploys name an environment its Epics' desired state touches are read. Each locks that environment: a crew's merge to that desired state waits on it, or takes a `blocked by` edge to it. The fleet merges desired state and never applies it; each apply is targeted.
- A Task that builds on another Epic's Task is `blocked by` it, never prose in a PR body.

**Escalate** a contract two Epics both shape. **Stop** on a cycle.

## Delegate

- One `sdlc-crew` per Epic, run as a sub-agent, a sub-session only when the person asks, split at Design [as a crew splits its authors](../sdlc-crew/SKILL.md#delegate): the orchestrator applies `designed`, citing its remit, unless the Design settles one of the Initiative's Stops or the remit's [stops](../sdlc/SKILL.md#roles). Those that do go to the person as one outline per wave.
- Every crew and author works in a worktree and branch namespace of its own; nothing commits in the orchestrator's checkout.
- The orchestrator writes no Epic's Design: one it wrote would go to the person.
- The person steers, halts or queries in the orchestrator's own session; a change to the plan is mirrored as a comment on the Initiative.
- Each Epic is framed, per [the hub's Frame](../sdlc/SKILL.md#phases), before its crew starts, and accepted, per [the hub's Accept](../sdlc/SKILL.md#phases), once it closes, from its delivery record against its Goal and Non-goals.
- As each Epic closes, Plan re-runs over the Epics it unblocks.

**Escalate** a Design that settles a stop. **Stop** when a crew stops.

## Review

Once every Epic closes, a fresh [`delivery-review`](../../agents/delivery-review.md) reads the Initiative against its approved outline and Plan. Its deviations go in Close's delivery record, in its words, for the person's Accept.

**Escalate** a deviation the Goal still needs, as an Epic or Task to file.

## Close

- The Goal's finish line is checked directly, and each Owed step is done; Measures, where any exist, inform the check and never replace it.
- Each child's state is read from GitHub, not from PR text.
- Every Publish its descendants block has closed, and the Release holding each, read from each descendant's `blocking` and each Publish's parent by title and state; their own blockers are never walked.
- A criterion met under another Epic closes **completed** with a link to where.
- Open children move back to the parent that owns their blocker, or to one [`sdlc-hygiene`'s Adopt](../sdlc-hygiene/SKILL.md#adopt) proposes.
- The roadmap entry names the Initiative as done.
- The delivery record is one comment on the Initiative, to [3C](../elegance/references/cells/3C-release.md): each Epic, its state, what landed, what dropped and where it moved, and what was accepted unchecked.

**Escalate** the close: closing an Initiative is a default stop, and its Accept is the person's.

## Reporting

[The hub's Reporting](../sdlc/SKILL.md#reporting), its status outline a row per Epic: its state, what runs, what it waits on. While a Publish its descendants block, or the Release holding one, is open, the outline carries "N of M Publishes, K of L Releases closed".
