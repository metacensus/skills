> A design states the target architecture and the plan to reach it within appetite, with non-goals; the system's boundaries are checkable, not narrated.

```
            2A roadmap
                ↑
3A design ↔ 3B contract ↔ 3C release
                ↓
            4A plan
```

Tier 3 · scope System · time Future

## Example

The target architecture · the plan to reach it within appetite · non-goals stated.

## Location

**Design Docs**, in the location key (grid).

## Clear when

structure stated matches what is built · boundaries are binary questions, near-misses named · plan fits appetite · someone with standing reviewed → every delta since is recorded

## Excess

| Excess | Test or move |
|---|---|
| **A design that restates the contract** | The contract is generated or typed in [3B](3B-contract.human.md); the design says what the system is for and where its boundaries fall. Cover the paragraph and read the 3B types; nothing lost → it was a copy. |
| **Alternatives rejected, at length** | One line each: what, and the cost that ruled it out. |
| **The system described from the outside in prose** | Hide the diagram; the prose adds no fact it did not show → cut the prose. |
| **Non-goals argued rather than stated** | State them. |
| **A design kept after it was reached** | Retire it into [3B](3B-contract.human.md), where the contract now lives. |

## Cost

A quarter of divergence across teams · seam drift that no single diff shows.

## Moves

1. Strengthen where possible: contract as generated types (a gate) · boundary as a binary question (checkable)
2. The system deviates → when the deviation is accepted → ✏️ rewrite the design; otherwise → the alteration goes to the system
3. Add a delta or a non-goal → one line, never more description
4. A hole → mark it, do not fill it
