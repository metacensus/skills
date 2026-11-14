> The skill is applied to itself: each of its files sits in a cell and answers "what does the reader lose if this goes?" This page is for changing it; for using it, see [SKILL](SKILL.human.md).

```
theory §1–4 → scope · time → grid → 5B code · 4B surface → check-cells.mts header
```

Read in this order. Links: [theory](references/theory.human.md) · [scope](references/scope.human.md) · [time](references/time.human.md) · [grid](references/grid.human.md).

## Changing the skill

A change owes:

- ⬜ **Cell named.** `check-cells.mts --diff` prints it.
- ⬜ **What it retires, named.** ⚠️ A rule that retires nothing is suspect; a sentence that removes none, more so.
- ⬜ **Edges kept.** Theory's section numbers anchor every link: `grep -r "theory.md#"` before moving one.
- ⬜ **One table, one file.** Each table lives in the page that numbers it; `check-cells.mts` fails when a cell and Table 3 disagree.
- ⬜ **Fresh reviewer.** Hand skill and diff to the [`elegance-review`](../../agents/elegance-review.md) agent; `--diff` says when it is owed. The writer is never the reviewer.
- ⬜ **Prescription in a cell.** Steps belong where the check and cost make them specific; SKILL and theory keep principles, moves, questions.

## The gradient

Each file reads top to bottom, abstract → tangible. The two ends are cut by different rules.

| End | Is | Rule |
|---|---|---|
| Ceiling | abstract, memorable, nebulous | principles; cut by the elegance test |
| Floor | questions that turn a ceiling rule into an act | the instrument against inertia |
| Boundary | where instruction stops and judgement starts | a trust decision: push the floor down only as far as the model needs |

- ⚠️ A floor question that restates a ceiling rule is not a duplicate edge. Cutting it as excess hands the model back its inertia; hold the line against reviewers' content test.
- A warrant can be behavioral: the claim that disappears, or the act the model stops taking. They diverge only at reformulation.

## Instruments

- ✅ Skeleton gate: `check-cells.mts`, the one instrument at gate confidence.
- ⚠️ Review yield: a pass reporting no findings and no failed attempts failed.

## Holes

- ⏸️ Net element change per pass and review yield: nothing records them.
- ⏸️ Nothing refuses to proceed without the review.
- ⏸️ The review trigger cannot exempt a tier-5-only change: a commit message is never a changed path.
- ⏸️ The owner's fixes to the last round's findings land unreviewed.
- ⏸️ `changedPaths()` reads a failing `git merge-base` as no committed paths; shallow or detached checkouts under-report.
- ⏸️ A port to a second organization is untried; inputs: git, the two tables, its `elegance-mapping.md`.
- ⏸️ Scope of a pass: when everything in range is poor, where the bound comes from.
