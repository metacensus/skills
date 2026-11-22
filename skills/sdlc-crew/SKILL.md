---
name: sdlc-crew
description: Carry an Epic from its Design to closed with a crew of agents: an author per child, a fresh reviewer per pull request, and a delegator holding the plan. Trigger when running, orchestrating, or delegating an Epic's children across agents, when designing an Epic's children, and when asking what the crew's delegator does next.
---

The delegator's stages, each run as [the hub's protocol](../sdlc/SKILL.md#stages) says, their comments on the Epic. The agent running them is every author's [`delegator`](../sdlc/SKILL.md#roles), and whoever handed it the Epic is its own. Under an Initiative, its delegator is [`sdlc-fleet`](../sdlc-fleet/SKILL.md), and the Initiative's Decided and Stops bind it as its own. It composes the sdlc flows and [`parallelize`](../parallelize/SKILL.md), and carries no child itself. It reports up as [the hub's Reporting](../sdlc/SKILL.md#reporting) says, and while a thread waits on a person, or the person is away, runs [`decouple`](../decouple/SKILL.md). It starts from a [handoff](../sdlc/SKILL.md#handoff), whose Environment names the model each child runs on.

## Precheck

- The Epic is open, its body carrying its form's required fields.
- The [mapping](../sdlc/SKILL.md#the-mapping) is read whole.
- The comment cites the delegator's own remit: which labels, merges, closes and branches it was handed, its stops, which checks its environment cannot run that it accepts unchecked, and that the rest escalate.
- [`sdlc-family`](../../agents/sdlc-family.md) has read the family, run inline when the delegator is itself delegated.

**Pass** goes to Design, which on an Epic carrying `designed` only files the children its body names, or to Plan on an Epic holding only a Spike, which designs once its Spike lands. **Escalate** a fix the delegator may not [make](../sdlc/SKILL.md#roles), and a question of `sdlc-family`'s on an Epic Plan takes; Design answers the rest. **Stop** on an Epic closed.

## Design

- The comment proposes the Epic's plan, to the bar [the ladder](../sdlc/SKILL.md#the-ladder) names: a human version, then its children, filed or to file, each a line with its type, goal and `blocked by`; its non-goals; the contracts its children share; and each change it asks of the Epic's body.
- It answers each of `sdlc-family`'s questions.
- Once its delegator applies `designed`, the children file per [`sdlc-capture`'s File](../sdlc-capture/SKILL.md#file), against [4A plan](../elegance/references/cells/4A-plan.md), each blocker before what it blocks, `--parent` the Epic and `--blocked-by` each stated blocker: at least one, a lone Spike enough.

**Escalate** until its own delegator applies `designed`; nothing files before. **Stop** when the Epic fails its bar.

## Plan

`parallelize` answered: units are the children; edges their `blocked by` and the contracts their write-sets share, a renamed term grepped across the repository before any brief; the action is [`sdlc-author`](../sdlc-author/SKILL.md); done is [the hub's Closing](../sdlc/SKILL.md#closing); the checks, [`sdlc-review`](../sdlc-review/SKILL.md) per PR.

- Each child carries `ready`, with every `blocked by` edge inside the Epic, set by its Initiative's Plan, or to a [Release or Rollout](../sdlc/SKILL.md#mechanisms), and the graph has no cycle; a child without `ready` is framed per [the hub's Frame](../sdlc/SKILL.md#phases), under the remit.
- The contract lands first, pinned in a file its consumers read, and merged before a consumer starts.
- No two write-sets in a wave overlap; a line no child owns goes to one, or to a child filed for it.
- The comment lists the waves, each child's write-set and contracts.

**Escalate** on a contract whose shape is the Epic's delegator's. **Stop** on a cycle, or when the children cannot be cut without overlap.

## Delegate

- A child is briefed only in [Ready](../sdlc/SKILL.md#status), or [stacked](../decouple/SKILL.md#stack): nothing else is authored ahead of its blockers, and an escalation's answer is waited for, never guessed.
- Each author's brief is `parallelize`'s, opening with its remit; a criterion's number is pointed at in the issue's Verification, never restated. Its frictions ride its return, nowhere else.
- Every author works in a tree of its own, Design-only included, or reads only through `git show`.
- Every author is split at Design: one agent runs Precheck and Design, then returns; the delegator confirms its Design and applies `designed`, citing its remit, unless the Design settles one of the remit's [stops](../sdlc/SKILL.md#roles); a second, briefed with the confirmed Design, runs Implement through Land. A child already `designed` skips the first.
- Authors spawn nothing.

**Escalate** a Design that settles a stop. **Stop** when an author stops.

## Review

- A fresh `sdlc-review` per PR, run by the delegator, never inside an author, its remit cited in the verdict.
- A check the environment cannot run stays unchecked, so the verdict escalates; the delegator takes it where its remit accepts that check unchecked.
- Findings go to the author's [Respond](../sdlc-author/SKILL.md#respond), in [the review loop](../elegance/SKILL.md#the-review-loop).

**Escalate** a finding whose choice is not the delegator's, and the loop's cap.

## Land

- Each child lands through its author's [Land](../sdlc-author/SKILL.md#land), as its remit allows; an escalated merge or close is the delegator's where its remit reaches, a shared identity's approval never counts as one.
- Each child, once [landed](../land/SKILL.md), is accepted, per [the hub's Accept](../sdlc/SKILL.md#phases): its Verification exits 0 on the default branch; a miss reopens it.
- A child's ruling, a Spike's decision among them, or work found in execution, is written into the criteria of each child it rules on, and sent to that child's author once briefed; the rest is captured under the Epic through [`sdlc-capture`](../sdlc-capture/SKILL.md), and Plan re-runs over the children unblocked at that moment, any captured under the Epic since among them, or Design, on an Epic not yet `designed`. A gap that changes the Epic's goal re-plans within the remit, else escalates.
- After a child lands, the delegator may re-estimate the children not yet briefed, adding, dropping, reordering or redefining them within the remit.

**Escalate** a merge the environment refuses, and a deviation the remit does not accept. **Stop** when a child's author stops on something that reopens the Epic's plan.

## Close

- Every child is closed, completed or, past a dead end, not planned.
- The rollout record is on the Epic: each child, its PR, who landed it, what was accepted unchecked, its Accept, and how each `deviated` child departed, in its verdict's words.
- Each Spike's `Decision:` is in the Epic's body, confirmed by the Epic's delegator.
- [`sdlc-hygiene`](../sdlc-hygiene/SKILL.md) scoped to the Epic finds nothing.
- The Epic is closed per [Closing](../sdlc/SKILL.md#closing): **completed** when its goal is met, **not planned** when a Spike shows the goal cannot or should not be met.

**Escalate** the close only on a dead end or a deviation; an Epic completed as planned closes with no escalation, and its rollout record goes to its delegator for [Accept](../sdlc/SKILL.md#phases). Escalate any question the sweep leaves.
