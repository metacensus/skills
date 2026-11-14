# The loop

A writer rereads its intent, not its page; an agent with fresh context has no intent to reread, so it sees the page. The loop puts such cold agents in every seat. A reply read once rarely needs it.

## The shape

```
ledger → drafts → pick → [critics → revisions → checks → pick] × rounds
```

| Role | Model | Gets | Returns |
|---|---|---|---|
| Ledger | Sonnet | the source | its atomic facts, each tagged `act`, `detail`, or `context` |
| Writer | Sonnet, one per [organizing idea](lenses.md#organizing-ideas) | source, ledger, this skill, its idea | a page built from scratch |
| Critic | Haiku on a pellet, Sonnet on a blast | the page, the source, a [lens](lenses.md#dimensions) | one to three changes, each sketched |
| Reviser | Sonnet | page, one critique, ledger, this skill | its own copy of the page |
| Checker | Haiku | ledger, page | the facts the page lost |
| Ranker | Sonnet | every version, the current page included, with reading load and lost facts by tier | the best, and why |

## Spending

Width pays more than depth. Four to eight drafts and one or two rounds of four candidates usually beat a long run; later rounds mostly keep the current page.

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

The person sees the page it returns before it replaces anything.
