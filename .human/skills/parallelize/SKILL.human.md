> Coordination is the price of limits: cut work at contract edges, run it in waves, and keep the orchestrator's memory for the map.

Fires: asked to parallelize, fan out, orchestrate, or run work across subagents; a task spans more units than one agent should carry.

```
Five answers → Classify edges → Cut → Decide → Pin contracts → Waves → Briefs → Integrate → Land
   (work)       tight·contract·loose   at contract   ⛔ user     files, not       widest      one per      orchestrator   per unit
                                        edges only    decides     prompts          independent  agent        decides        via checkin
```

Orchestrator keeps: map · contracts · schedule · each agent's summary. Nothing else.

## What the work answers

This skill does no work itself. The work (one skill, several, or the request alone) answers five questions. Where one is missing, derive it and say so.

| # | Question | Answers |
|---|---|---|
| 1 | Units | what one piece is, in a given scope |
| 2 | Edges | how to find which units depend on which |
| 3 | Action | what is done to a unit |
| 4 | Done | the check that proves a unit finished |
| 5 | Checks | which checks judge it, and to what standard; loop is [`elegance`'s](../elegance/SKILL.human.md#the-review-loop); the work names a check, never how it runs |

## Edges decide the cut

| Edge | Test | Example | Cut? |
|---|---|---|---|
| Tight | cannot finish one without seeing inside the other; or what crosses takes more than two sentences | a file and its only caller; a doc and its human twin | ⛔ keep in one unit |
| Contract | depends on a small, statable surface | a signature, a glossary, a governing doc | ✅ clean cut |
| Loose | awareness only | cross-reference, "see also" | ✅ no order; write down what crosses |

## Partition

Cut at contract edges, never finer.

- Too small to repay an agent's startup → merge into a neighbour.
- Too large for a context → split only at its internal contracts.

Strategies, strongest first:

| # | Strategy | Does |
|---|---|---|
| 1 | Hub extraction | the item most others depend on, plus what only it reaches, is one unit built first; the rest usually falls apart |
| 2 | Branch peeling | large branches with one parent run in parallel; the trunk assembles last |
| 3 | Grouping | by owner or destination, when nothing better shows |

## Owning and sharing

| Rule | Means |
|---|---|
| Execution is exclusive | one owner per item at a time; write-sets in a wave never overlap, scratch included |
| Context is shared | same contracts and skills loaded, so most questions settle alone |
| Information moves laterally | a change belonging to another unit → proposed to its owner in the review loop; at the cap the orchestrator decides |
| Shared file, many proposers | a steward (often the orchestrator) owns it and takes proposals |
| Traffic measures the cut | heavy exchange across an edge → it was tight; merge at the next wave |

## Decide before fanning out

when an edge cannot be classified until something is decided (naming rule, scope, layout) → ⛔ research first in one agent, and take the user's decisions to the user. Left to authors, each decides differently.

## Contracts

- Pin when several units depend on it, or changing it later is expensive; otherwise suggest a shape.
- Pinned contracts live in files agents read, not only in prompts.
- A contract changes → everything downstream is ⚠️ suspect until re-checked.

## Waves

A wave is every unit with no unfinished dependency, run in parallel. Real parallelism is the widest set with no path between units.

- consumer may start before producer ends once their contract is pinned
- cap concurrent agents by review capacity and conflict cost, not throughput
- skip units already correct

## The brief

One per agent, in this order:

| # | Field | Holds |
|---|---|---|
| 1 | Remit | choices it owns; where the rest escalate (orchestrator, then whoever handed it the work) |
| 2 | Items | listed |
| 3 | Write-set | what it may change |
| 4 | Read-set | what it may read |
| 5 | Skills | every one governing its items, and each check's standard, named, not left to trigger |
| 6 | Contracts | those it honours |
| 7 | Neighbours | who owns items it may propose changes to, and how to reach them |
| 8 | Done | its check |
| 9 | Return | compact: did · proposed contract changes · open questions |

Rules: assume no tool the agent type lacks. A runner that is itself delegated runs checks inline, since a nested agent's findings never reach the orchestrator. Git stays the orchestrator's unless the remit hands it down.

## Integrate and land

- The orchestrator decides what reaches the cap, applies proposals to files it stewards, then runs the whole-system check.
- Branch handed over → commits each unit as it lands, per [`checkin`](../checkin/SKILL.human.md), so the PR shows the work in dependency order.
