> The skill is held to its own test: what does the reader lose if this goes? This page is for changing it; to use it, see [SKILL](SKILL.human.md).

Read: [theory](references/theory.human.md) §1–4 → [scope](references/scope.human.md) · [time](references/time.human.md) → [grid](references/grid.human.md) → cells 5B, 4B.

## Changing the skill

- ⬜ **Cell named.** `check-cells.mts --diff` prints it.
- ⬜ **What it retires, named.** ⚠️ A rule retiring nothing is suspect.
- ⬜ **Edges kept.** `grep -r "theory.md#"` before moving a section.
- ⬜ **Fresh reviewer.** The [`elegance-review`](../../agents/elegance-review.human.md) agent `sdlc-review` starts; the writer never reviews.
- ⬜ **Prescription in a cell.** SKILL and theory keep principles, moves, questions.

## The gradient

| End | Is |
|---|---|
| Ceiling | abstract, memorable |
| Floor | questions turning a rule into an act: the instrument against inertia |
| Boundary | a trust decision: push the floor down only as far as the model needs |

⚠️ A floor question restating a ceiling rule is not a duplicate; cutting it restores inertia.

## Holes

- ⏸️ Nothing records net element change per pass or review yield.
- ⏸️ Nothing refuses to proceed without review; the last round's fixes land unreviewed.
- ⏸️ Shallow or detached checkouts under-report changed paths.
