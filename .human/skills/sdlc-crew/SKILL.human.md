> A delegator carries a `designed` Epic to closed: an author per child, a fresh reviewer per pull request, and the plan held by the delegator, who carries no child itself.

Fires: running, orchestrating or delegating an Epic's children across agents, or asking what the delegator does next.

Precheck → Plan → Delegate → Review → Land → Close

Key: ⛔ escalate, then wait · 🛑 stop · ✅ must hold · ⬜ do

Each stage runs as [the hub's protocol](../sdlc/SKILL.human.md#stages) says, with its comments on the Epic.

| Who | Role |
|---|---|
| The delegator | the agent running the stages; every author's [`delegator`](../sdlc/SKILL.human.md#roles) |
| Whoever handed it the Epic | the delegator's own `delegator` |
| The brief | one environment's tools, worktrees, refusals, and each child's model |

It composes the sdlc flows and [`parallelize`](../parallelize/SKILL.human.md), and reports up as [the hub's Reporting](../sdlc/SKILL.human.md#reporting) says.

## Precheck

| | Must hold |
|---|---|
| ✅ | Epic carries `designed`, with at least one child filed; a lone Spike is enough |
| ✅ | Every child carries `ready`; each `blocked by` edge stays inside the Epic, otherwise [`sdlc-intake`'s Curate](../sdlc-intake/SKILL.human.md#curate) under the remit |
| ✅ | The `blocked by` graph has no cycle |
| ✅ | The [mapping](../sdlc/SKILL.human.md#the-mapping) is read whole |
| ✅ | The comment cites the delegator's remit: labels, merges, closes and branches handed over; checks it accepts unchecked; the rest escalate |
| ✅ | [`sdlc-family`](../../agents/sdlc-family.human.md) has read the family (run inline when the delegator is itself delegated) |

⛔ a question of `sdlc-family`'s · a fix the delegator may not [make](../sdlc/SKILL.human.md#roles)

🛑 a cycle · an Epic closed or without `designed`

## Plan

`parallelize` answered:

| Asks | Answer |
|---|---|
| Units | the children |
| Edges | their `blocked by`, plus contracts their write-sets share (grep a renamed term across the repo before any brief) |
| Action | [`sdlc-author`](../sdlc-author/SKILL.human.md) |
| Done | [the hub's Closing](../sdlc/SKILL.human.md#closing) |
| Checks | [`sdlc-review`](../sdlc-review/SKILL.human.md) per PR |

- ✅ Contract lands first: pinned in a file its consumers read, merged before a consumer starts
- ✅ No two write-sets in a wave overlap; a line no child owns goes to one, or to a child filed for it
- ⬜ Comment lists the waves, each child's write-set and contracts

⛔ a contract whose shape is the Epic's delegator's

🛑 children cannot be cut without overlap

## Delegate

| Rule | Detail |
|---|---|
| When | Brief a child only in [Ready](../sdlc/SKILL.human.md#status); nothing is authored ahead of its blockers; an escalation's answer is waited for, never guessed |
| Brief | `parallelize`'s, opening with the remit; criteria are pointed at by number in the issue's Verification, never restated |
| Frictions | ride the author's return, nowhere else |
| Tree | every author has its own, Design-only included, or reads only through `git show` |
| Spawning | authors spawn nothing |

Each author is split at Design:

Author 1 (Precheck, Design) → return → delegator confirms Design, applies `designed` (within remit, else ⛔) → Author 2 (briefed with the confirmed Design; Implement → Land)

A child already `designed` skips Author 1.

⛔ a Design outside the remit

🛑 an author stops

## Review

| Rule | Detail |
|---|---|
| Who | a fresh `sdlc-review` per PR, run by the delegator, never inside an author |
| Verdict | cites the remit |
| Unrunnable check | stays unchecked, so the verdict escalates; the delegator takes it where its remit accepts that check unchecked |
| Findings | go to the author's [Respond](../sdlc-author/SKILL.human.md#respond), in [the review loop](../elegance/SKILL.human.md#the-review-loop) |

⛔ a finding whose choice is not the delegator's · the loop's cap

## Land

| Case | Action |
|---|---|
| Each child | lands through its author's [Land](../sdlc-author/SKILL.human.md#land) as its remit allows |
| Escalated merge or close | the delegator's where its remit reaches; a shared identity's approval never counts as one |
| Spike decision, or work found in execution | files new children via [`sdlc-intake`](../sdlc-intake/SKILL.human.md#decompose) under the Epic, curated as Precheck says; Plan re-runs over children unblocked at that moment |
| Gap that changes the Epic's goal | re-plan within the remit, else ⛔ |
| After a child lands | delegator may re-estimate unbriefed children: add, drop, reorder, redefine, within the remit |

⛔ a merge the environment refuses

🛑 a child's stop reopens the Epic's plan

## Close

| | Must hold |
|---|---|
| ✅ | Every child closed: completed or, past a dead end, not planned |
| ✅ | Rollout record on the Epic: each child, its PR, who landed it, what was accepted unchecked |
| ✅ | Each Spike's `Decision:` is in the Epic's body; the Spike is `reached-up` |
| ✅ | [`sdlc-hygiene`](../sdlc-hygiene/SKILL.human.md) scoped to the Epic finds nothing |
| ✅ | Epic closed per [Closing](../sdlc/SKILL.human.md#closing) |

| Goal | Close as |
|---|---|
| met | **completed** |
| a Spike shows it cannot or should not be met | **not planned** |

⛔ the close only on a dead end or a deviation (completed as planned: no escalation) · any question the sweep leaves
