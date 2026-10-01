---
name: parallelize
description: Organize a body of work across agents that share one working tree — cut it into units, schedule them in dependency order, and give each the coordination it needs and no more. Agnostic to the work — one skill's, several at once, or a request no skill covers — at a scale one context cannot hold. Trigger when the user asks to parallelize, fan out, orchestrate, or run work across subagents, or when a task spans more units than one agent should carry.
---

> Vision without execution is hallucination, but execution without coordination is chaos.

**Coordination is the price of limits.** An executor is bounded by bandwidth, how much it does at once, and by memory, how much it holds at once. Work split for bandwidth runs in parallel; work split for memory can be finished at all. Every split is a seam, and every seam must be coordinated. Only an executor with unlimited bandwidth and memory — a limit no real one reaches — would need none; every real one pays, so the aim is the organization that pays least: not a shapeless swarm, which coordinates everything, but a semi-hierarchical team whose members share context.

The orchestrator keeps the map, the contracts, the schedule, and each agent's summary — nothing else. Its memory is the scarcest in the system.

## What the work answers

This skill does no work of its own. Whatever defines the work — one skill, several, or the request alone — answers five questions:

- **Units** — what one piece of work is, within a given scope.
- **Edges** — how to find which units depend on which.
- **Action** — what is done to a unit.
- **Done** — the check that proves a unit is finished.
- **Review** — which standard a unit is judged against, if any; the loop is [`elegance`'s](../elegance/SKILL.md#the-review-loop).

Where an answer is missing, derive it from the work and say which you derived.

## Edges decide the cut

- **Tight** — one unit cannot be done without seeing inside the other: a file and its only caller, a doc and its human twin. Keep both in one unit.
- **Contract** — one unit depends on a small, statable surface of the other: a signature, a glossary, a governing doc. A clean cut. If what crosses cannot be said in two sentences, the edge is tight.
- **Loose** — awareness without dependency: a cross-reference, a "see also". No ordering, but write down what crosses.

## Partition

Cut at contract edges and never finer. Merge a unit too small to repay an agent's startup into its neighbour; split one too large for a context only at its internal contracts.

Three strategies, strongest first. **Hub extraction**: the item most others depend on, plus what is reachable only through it, becomes one unit built first — the rest usually falls apart. **Branch peeling**: large branches used by one parent go in parallel; the trunk assembles them last. **Grouping** by owner or destination, when the dependencies suggest nothing better.

## Owning and sharing

**Execution is exclusive.** Every item has exactly one owner at a time, and write-sets in a wave never overlap — scratch space included.

**Context is shared.** Agents that load the same contracts and skills settle most questions alone; shared context is coordination nobody has to do.

**Information moves laterally.** A unit that finds a change belonging to another unit's items proposes it to that owner, in the review loop; at the cap the orchestrator decides. A shared file with many proposers gets a steward, often the orchestrator, who owns it and takes proposals.

**Traffic measures the cut.** Heavy exchange across an edge means it was tight; merge those units at the next wave.

## Decide before fanning out

Some edges cannot be classified until someone decides something: a naming rule, a scope, a layout. Research first, in one agent, and bring the decisions that are the user's to the user. Left to authors, each decides differently.

## Contracts

Pin a contract where several units depend on it or where changing it later is expensive; elsewhere suggest a shape. Pinned contracts live in files agents read, not only in prompts. When a contract changes, everything downstream of it is suspect until re-checked.

## Waves

A wave is every unit with no unfinished dependency, run in parallel; the real parallelism is the widest set of units with no path between them. A consumer may start before its producer finishes once the contract between them is pinned. Cap concurrent agents by review capacity and conflict cost, not throughput. Skip units already correct.

## The brief

Each agent gets its **items**, listed, its **write-set**, its **read-set**, the **skills** it loads — every one that governs its items, and any review standard, named rather than left to trigger — the **contracts** it honours, its **neighbours** (who owns the items it may propose changes to, and how to reach them), its **done** check, and a **return** of a compact summary: what it did, contract changes it proposes, open questions. Nothing in a brief may assume a tool the agent type lacks. It never commits.

## Integrate and land

The orchestrator decides what reaches it at a cap and applies proposals to the files it stewards, then runs the whole-system check. When the user has handed it the branch, it commits each unit as it lands, following [`checkin`](../checkin/SKILL.md), so the pull request is a live view of the work in dependency order.
