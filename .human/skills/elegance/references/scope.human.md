> Scope is how long reality takes to report a node wrong. Six tiers, one [grid](grid.human.md) row each.

```
0 Principles → 1 Field → 2 Organization → 3 System → 4 Module → 5 File
decade+ ─────────────────────────────────────────────────────► minutes
```

## Table 1 — Scope (the tier ladder)

| Tier | Latency | Drift instrument |
|---|---|---|
| 0 | decade+ | do tiers below keep passing |
| 1 | years to decades | contact: stakeholders, users |
| 2 | years | solution against problem |
| 3 | quarter to year | design vs system; contract review |
| 4 | weeks | plan closed at checkin |
| 5 | minutes to days | CI; the diff |

## Which tier is this?

Bottom three: who must agree?

```
nobody (inside one file)           → 5
callers (a module's exports)       → 4
a seam's other side (system surface) → 3
```

Publishing, or an edit in another repo, is 3.

Abstract with few dependents is a proposal (0A, not 0B); concrete with many is higher than it reads; explaining a tier above is misplaced, so move up.
