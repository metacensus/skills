---
name: sdlc-crew
description: Carry a `designed` Epic to closed with a crew of agents: an author per child, a fresh reviewer per pull request, and a delegator holding the plan. Trigger when running, orchestrating, or delegating an Epic's children across agents, and when asking what the crew's delegator does next.
---

The delegator's stages, each run as [the hub's protocol](../sdlc/SKILL.md#stages) says, their comments on the Epic. The agent running them is every author's [`delegator`](../sdlc/SKILL.md#roles), and whoever handed it the Epic is its own. It composes the sdlc flows and [`parallelize`](../parallelize/SKILL.md), and carries no child itself. The brief carries what one environment needs, its tools, worktrees and refusals, and the model each child runs on.

## Precheck

- The Epic carries `designed` and has at least one child filed; a lone Spike is enough.
- Each child carries `ready`, with every `blocked by` edge inside the Epic; one that does not goes through [`sdlc-intake`'s Curate](../sdlc-intake/SKILL.md#curate), under the remit.
- The `blocked by` graph has no cycle.
- The [mapping](../sdlc/SKILL.md#the-mapping) is read whole.
- The comment cites the delegator's own remit: which labels, merges, closes and branches it was handed, which checks its environment cannot run that it accepts unchecked, and that the rest escalate.
- [`sdlc-family`](../../agents/sdlc-family.md) has read the family, run inline when the delegator is itself delegated; its questions go to the Epic's `owner`.

**Escalate** on a question of `sdlc-family`'s, or a fix the delegator may only [propose](../sdlc/SKILL.md#roles). **Stop** on a cycle, or an Epic closed or without `designed`.

## Plan

`parallelize` answered: units are the children; edges their `blocked by` and the contracts their write-sets share, a renamed term grepped across the repository before any brief; the action is [`sdlc-author`](../sdlc-author/SKILL.md); done is [the hub's Closing](../sdlc/SKILL.md#closing); the checks, [`sdlc-review`](../sdlc-review/SKILL.md) per PR.

- The contract lands first, pinned in a file its consumers read, and merged before a consumer starts.
- No two write-sets in a wave overlap; a line no child owns goes to one, or to a child filed for it.
- The comment lists the waves, each child's write-set and contracts.

**Escalate** on a contract whose shape is the Epic's delegator's. **Stop** when the children cannot be cut without overlap.

## Delegate

- A child is briefed only in [Ready](../sdlc/SKILL.md#status): nothing is authored ahead of its blockers, and an escalation's answer is waited for, never guessed.
- Each author's brief is `parallelize`'s, opening with its remit; a criterion's number is pointed at in the issue's Verification, never restated. Its frictions ride its return, nowhere else.
- Every author works in a tree of its own, Design-only included, or reads only through `git show`.
- Every author is split at Design: one agent runs Precheck and Design, then returns; its Design is confirmed, `designed` applied, within the delegator's remit, else escalated; a second, briefed with the confirmed Design, runs Implement through Land. A child already `designed` skips the first.
- Authors spawn nothing; the checks their brief names run inline, and a brief assumes no tool the agent lacks.

**Escalate** a Design outside the remit. **Stop** when an author stops.

## Review

- A fresh `sdlc-review` per PR, run by the delegator, never inside an author, its remit cited in the verdict.
- A check the environment cannot run stays unchecked; its verdict passes only where the remit accepts that check unchecked.
- Findings go to the author's [Respond](../sdlc-author/SKILL.md#respond), in [the review loop](../elegance/SKILL.md#the-review-loop).

**Escalate** a finding whose choice is not the delegator's, and the loop's cap.

## Land

- Each child lands through its author's [Land](../sdlc-author/SKILL.md#land), as its remit allows; an escalated merge or close is the delegator's where its remit reaches, a shared identity's approval never counts as one.
- A Spike's decision, or work found in execution, files new children through [`sdlc-intake`](../sdlc-intake/SKILL.md#decompose) under the Epic, and Plan re-runs over the children unblocked at that moment. A gap that changes the Epic's goal re-plans within the remit, else escalates.

**Escalate** a merge the environment refuses. **Stop** when a child's stop reopens the Epic's plan.

## Close

- The rollout record is on the Epic: each child, its PR, who landed it, and what was accepted unchecked.
- Each Spike's `Decision:` is in the Epic's body, the Spike `reached-up`.
- [`sdlc-hygiene`](../sdlc-hygiene/SKILL.md) scoped to the Epic finds nothing.
- The Epic is closed per [Closing](../sdlc/SKILL.md#closing): **completed** when its goal is met, **not planned** when a Spike shows the goal cannot or should not be met.

**Escalate** the close where the remit does not reach the Epic, a dead end always, and any question the sweep leaves.
