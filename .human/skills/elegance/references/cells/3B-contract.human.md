> The contract a system exposes must equal the contract it implements; the readme is how a newcomer runs and contributes.

```
        2B identity
            ↑
3A design ↔ 3B contract ↔ 3C release
            ↓
        4B surface
```

Tier 3 · scope System · time Current

## Example

The contract the system exposes · how to run it · how to contribute.

## Location

**Project API/Docs**, in the location key (grid).

## Clear when

exposed contract = implemented contract · both sides of every seam agree · newcomer runs and contributes from the readme unasked · gate: generated or typed contract, docs at review or assertion

## Excess

| Excess | Test or move |
|---|---|
| **A readme that describes the code** | Says what the system is, what it refuses, how to run. Each line: is, refuses, or runs? Anything about how it is built links down: architecture to [3A](3A-design.human.md), module surfaces to [4B](4B-surface.human.md). |
| **Prose beside a generated contract** | Cover the sentence; read the field's name and type. They say it → the sentence is a second copy. |
| **A contributor guide that restates the gate** | Name the command; the gate's output says what it checks. |
| **A one-way door explained more than once** | Explain once, at the door, where the choice was made. |
| **"What this is not" grown into an essay** | A list of refused concerns, one line each. |

## Cost

⚠️ The most dangerous cell: a semantic collision on an identical signature executes rather than errors, and no instrument sees it.

## Moves

1. Generate the contract from the implementation, or the reverse → they cannot disagree
2. Surface moves → ✏️ rewrite the docs in the same change
3. Link down to [4B](4B-surface.human.md) → record a delta, never describe the surface again
