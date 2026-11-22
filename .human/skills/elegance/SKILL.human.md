> Fewest elements that stay clear. "Fine as is" is never a finding.

Fires: writing, rewriting, reviewing or removing anything persistent (code, comments, docs, plans, issues, data, memory, commit text); or asked if it should exist.

```
Element → what does the reader lose if it goes?
  ├ nothing   → Retire
  └ something → does a smaller or better-placed element carry it?
        ├ yes → Merge · Move up · Replace · Derive
        └ no  → keep, and name what it carries
```

## The scope of an alteration

Retire sections before polishing sentences. ⚠️ Every sentence feels critical: go up one. ⚠️ The urge to add: you have not found what to remove.

## Prose about code

A summary sits one scope above its subject; an illustration is shorter than the code beside it. A comment on a private function: it goes, or the code is refactored.

## Moves

The order is the point.

| # | Move | Do |
|---|---|---|
| 1 | Retire | delete ([§4.3](references/theory.human.md#43-keeping-the-loop-closed)) |
| 2 | Merge | one thing, one node ([§2.3](references/theory.human.md#23-the-graph)) |
| 3 | Move up | summarize up ([§4.2](references/theory.human.md#42-where-information-goes)) |
| 4 | Replace | a name, type, test or gate |
| 5 | Derive | the computer prints it |
| 6 | Rewrite whole | no residue |
| 7 | Mark the hole | a named absence ([§3.4](references/theory.human.md#34-holes)) |
| 8 | Add, last | name what it retires |

## The model

[scope](references/scope.human.md) tiers 0 to 5 · [time](references/time.human.md) A future, B current, C past · [grid](references/grid.human.md) cells, e.g. 3A. Confidence is the check passed, never fluency ([§3.3](references/theory.human.md#33-pricing-drift)).

## Questions worth asking

1. Summary or illustration, and shorter than its subject?
2. Where would the reader look for this?
3. Could the artifact carry this instead?
4. Would anyone fix this if its subject changed?

## Before you finish

- ⬜ **Counts.** Nodes holding one fact are a finding.
- ⬜ **Cells.** `check-cells.mts --diff`; an unexpected one is an alteration to undo.

## The review loop

At most 3 rounds, same reviewer. ⛔ At the cap a disputed span goes up with both positions to its owner.

## Reading the references

```
tier + station → cells/<tier><station>-*.md → location → elegance-mapping.md
```

Changing it: [README](README.human.md).
