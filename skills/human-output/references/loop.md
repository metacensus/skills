# The loop

A writer rereads its intent, not its page; an agent with fresh context has no intent to reread, so it sees the page. The loop puts such cold agents in every seat: writers, critics, a reviser, a checker, and a ranker.

It earns its cost on a page read often or by many: a twin, an issue body, a README, a lead's status. A reply read once rarely needs it.

## The shape

```
ledger → drafts → pick → rounds: critics → revisions → checks → pick
```

- **Ledger:** the source's atomic facts, each tagged `act` (needed to act or decide), `detail` (some readers need it; it can sit lower), or `context` (it can usually go).
- **Drafts:** writers each build the page from scratch around one [organizing idea](lenses.md#organizing-ideas), and the ranker picks one; a current page, when there is one, competes with them.
- **Rounds:** critics each look through a [lens](lenses.md#dimensions); a reviser applies each critique to its own copy; a checker marks the ledger facts each copy lost; the ranker keeps the best version, the current one included.

## Roles

| Role | Model | Gets | Returns |
|---|---|---|---|
| Ledger | Sonnet | the source | facts, each tagged |
| Writer | Sonnet | source, ledger, this skill, one organizing idea | a page |
| Critic | Haiku on a pellet, Sonnet on a blast | the page, the source, a lens | one to three changes, each sketched |
| Reviser | Sonnet | page, critique, ledger, this skill | the page |
| Checker | Haiku | ledger, page | the facts the page lost |
| Ranker | Sonnet | every version, with reading load and lost facts by tier | the best, and why |

## Spending

- Width pays more than depth. Four to eight drafts and one or two rounds of four candidates usually beat a long run; later rounds mostly keep the current page.
- Reorganizing lenses carry the gains, and drawing a view the source only implies carries the largest. [Curation](lenses.md#curation) seldom moves a page already drawn for the eye.
- One round can mix models: Haiku critics on pellets, Sonnet critics on blasts.
- A judge's score moves a point or two between runs, so a smaller difference is noise.

## Picking

The ranker weighs layout, reading load, and loss together: a lost `act` fact costs a lot, a `detail` fact some, a `context` fact little. Keeping the current page is a good answer when nothing beats it.

## Running it

[`scripts/human-output-loop.js`](../../../scripts/human-output-loop.js) runs the loop as a Workflow, about 25 agent calls at its defaults. It runs when the person asks for it or invokes this skill for it:

```
Workflow({ scriptPath: "${CLAUDE_PLUGIN_ROOT}/scripts/human-output-loop.js", args: {
  skillRoot: "${CLAUDE_PLUGIN_ROOT}/skills/human-output",
  medium: "parallel",            // chat · parallel · github
  sourcePath: "<file>",          // or sourceText
  current: "<page, optional>",
  drafts: 4, rounds: 1, beam: 4 } })
```

It returns the best page, the facts it lost, and each pick with the ranker's reason. The person sees the page before it replaces anything.
