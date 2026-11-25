---
name: sdlc-campaign
description: Carry a Rollout, Releases with time and conditions between them, from its plan to its end state live, across days or weeks mostly spent waiting. Trigger when planning, running, waking, resuming or closing a Rollout, and when a change to production needs time or a condition between its Releases.
---

The campaign's stages, each run as [the hub's protocol](../sdlc/SKILL.md#stages) says, their comments on the Rollout. One long-lived agent carries one Rollout; it is each Release's [`delegator`](../sdlc/SKILL.md#roles), and a person is its own. A change needing no time or condition between its Releases is one Release, carried by [`sdlc-ship`](../sdlc-ship/SKILL.md) alone, or a Publish alone where [the production tiers](../sdlc/references/production.md#the-tiers) needs no Release.

Its state lives on the Rollout, so a replacement agent resumes from there:

- **The plan**, in the body.
- **The status comment**, the only comment it edits: a row per phase, each gate's reading with its time, the next wake and the deadline.
- **The decision log**: its stage comments, one per decision, never edited.

Before each action it writes its intent in the status comment, after it the result in the decision log, and each action first checks whether it is already done.

## Precheck

- The Rollout is open, its body carrying its form's required fields, and assigned to the acting identity.
- Its Releases, their `blocked by` edges and its gate Tasks are read from GitHub.

**Pass** goes to Plan, or to Verify on a plan carrying `designed` whose issues are filed. **Stop** on a Rollout closed.

## Plan

The Releases form a graph: each is a sub-issue of the Rollout, `blocked by` exactly what it needs, a specific earlier Release or a gate Task, and nothing more, and Releases with no edge between them run in parallel. A gate Task is work a phase needs, under the parent that owns it, carried by that parent's crew or fleet: the campaign authors no code.

The body holds the end state its Goal names, and a row per phase, a layer of the graph:

- its purpose and its Releases;
- its conditions on the live system, each a threshold over a window or a soak, the only gates the body holds;
- its expected wait, counted from the previous phase's last Release accepted, and its deadline;
- its back-out: a configuration change or a Release restoring the earlier behavior, or none where the phase only adds;
- whether it is one-way: whether it holds a Release whose plan will name a one-way step.

As few phases one-way as the end state allows, each as late as it can be. The last phase is the cleanup: flags removed, dual paths off, old code deleted, old versions retired.

The Rollout's Exposure sizes every gate: soak windows, minimum waits, re-reads before an apply, a staging step where staging already runs the digest, and approvals per small change. Each wait states what it covers and why its Exposure needs it. At greenfield, a static site takes no soak, no wait runs past about five minutes without a stated reason, and one approval carries a small change through merge and tag.

At every Exposure, the phase that first goes public has its Releases blocked by a [`launch-review`](../launch-review/SKILL.md) and a security audit, each a gate Task, never run once it is live.

**Escalate** the plan: the person approves it once by applying `designed`, which turns each reversible start of a phase into a rule the agent applies. A change to the plan takes `designed` off and escalates again. A plan of one phase escalates as a Release with no Rollout.

Once `designed` is applied, and not before, the Releases file per [`sdlc-capture`](../sdlc-capture/SKILL.md#file), `--parent` the Rollout, the gate Tasks under the parents that own them, and then each Release's edges.

## Change

A Release starts once its blockers are closed and Verify finds its phase's conditions holding:

- One `sdlc-ship` sub-agent per Release, under [`parallelize`](../parallelize/SKILL.md) where the phase holds more than one: units its Releases, edges their `blocked by`, the action `sdlc-ship`, done each Release closed and accepted.
- A reversible Release's yes is the Rollout's `designed`: once its plan matches its phase and passes [`plan-check`](../../agents/plan-check.md), the campaign applies `designed` to it, citing the Rollout's, its live readings gathered as [`sdlc-ship`'s Plan](../sdlc-ship/SKILL.md#plan) says.
- A Release is one-way when its plan names a one-way step, whatever its phase says. A plan that does not match its phase escalates, and the Release waits.
- A one-way Release needs its own yes. Its brief names the phase's conditions as preconditions, `plan-check` confirms each from production evidence, and the person applies `designed` given that verdict. The campaign never certifies its own point of no return.
- A Release already started resumes, never restarts.
- Each closed Release is accepted, per [the hub's Accept](../sdlc/SKILL.md#phases), against the live system: its digests running where its record says. A miss reopens it.

**Escalate** what a Release's carrier escalates, with the back-out the plan names. **Stop** before carrying a gate Task.

## Verify

Every wake runs Verify, the first after Plan among them. Each reading comes from the live system: a closed issue is merged, not live, so its state counts only where the live system agrees, and a check that cannot be read is unmet. A reading's window is anchored to the apply time, and counts only once propagation, DNS and certificates among it, is waited out.

1. Every earlier phase still holds: its digests running, its flags set.
2. The current phase's conditions are read, then the next phase's, and its Releases' blockers.
3. The status comment is updated, and the next wake set: events first (an issue closes, a comment arrives, a label is applied, an alert fires, a date comes), a poll as backstop at about a tenth of the phase's expected wait left, from 15 minutes to a day, and hourly while only a person's answer is awaited.

- A Release's blockers are closed and its phase's conditions hold: Change runs it.
- The last phase holds and the end state is live: Close.
- A regression: no Release starts, the back-out the plan names for that phase runs at once, and it escalates.

A wake that decides nothing posts no comment.

**Escalate** at a deadline; on a stall, past the phase's expected wait with no gate newly met across three readings; a check unread three readings running; and a changed world, such as a new consumer of what the plan retires or another Release on the same assets. Each offers extend, back out, abandon or re-plan.

## Failure

- Before the first one-way phase starts, abandoning runs the back-outs in reverse phase order; a Publish stays published, so a back-out moves forward to the earlier behavior. The Rollout then closes **not planned**.
- After it, only fix forward: a new phase, approved as Plan says.

## Close

- Every Release is closed and accepted, and the cleanup phase holds.
- The record is one comment, to [3C](../elegance/references/cells/3C-release.md): each Release in order with its dates, the end state as live, and what lingers, such as deprecated versions still served.

**Escalate** the close: no carrier sits above a Rollout, so its Accept is the person's.

## The runtime

What wakes it is not this skill's. It needs:

- a wake on a timer and on events: an issue it watches closes, a comment arrives, a label is applied, an alert fires;
- a watchdog flagging a Rollout whose status comment is older than its next wake;
- read access to production.
