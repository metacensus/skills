> Scope is how long reality takes to report a node wrong. Six tiers, one grid row each, named by the chunk of world the node is about.

```
0 Principles → 1 Field → 2 Organization → 3 System → 4 Module → 5 File
decade+ ─────────────────────────────────────────────────────► minutes
```

Latency is defined in [theory §1.2](theory.human.md#12-elegance). A tier is one row of [grid](grid.human.md): tier digit + station letter, e.g. 3A.

## Table 1 — Scope (the tier ladder)

| Tier | Name | Feedback latency | Cadence | Work object | Who reads it | Drift instrument |
|---|---|---|---|---|---|---|
| 0 | Principles | decade+; learned only when tiers derived from it fail | almost never | · | everyone | generativity: do tiers below keep passing their checks |
| 1 | Field | years to decades | rarely | · | the field | contact with the world: stakeholders, literature, users |
| 2 | Organization | years | yearly | · | the organization | periodic review of solution against problem |
| 3 | System | quarter to year | quarterly | Initiative: a chunk of the solution with an owner and an appetite | a team, and the other side of a seam | design vs system reconciliation; boundary and contract review |
| 4 | Module | weeks | weekly | Epic: a parent holding children | a pair, and the module's callers | the plan closed at checkin: done, not done, or deviated |
| 5 | File | minutes to days | daily | Task or Bug: a leaf and its change | one individual, increasingly an agent | CI; acceptance criteria; the diff |

- Pair: a lead and an individual contributor on one module.
- Each chunk is a piece of the one above. At 3-5 a work object owns the chunk while it changes; the parent link is the primary relation. 0-2 have none.

## Which tier is this?

Ask what chunk of the world the node is about and how long reality would take to report it wrong. Bottom three: who must agree?

| Change | Needs | Tier |
|---|---|---|
| inside one file | nobody | 5 |
| what a module exports | its callers | 4 |
| what a system exposes | the other side of a seam: repo, team, published package | 3 |

Publishing is the tell: a version bump, coordinated deploy, or edit in a repo you are not in is 3, however few lines.

Two signals correct the guess:

| Signal | Reads as | Move |
|---|---|---|
| Connectedness ([theory §2.3](theory.human.md#23-the-graph)) | abstract with few dependents is a proposal: 0A, not 0B | · |
| Connectedness | concrete with many dependents is higher than it reads | up |
| Misplacement ([theory §3.2](theory.human.md#32-how-drift-compounds)) | explains a tier above its own | up, to that tier |

## Along scope

| Down the ladder | Bottom (5) | Middle (3-4) | Top (0) |
|---|---|---|---|
| Check changes kind | direct: run the test | indirect, then reconciliation: plan judged by children closed; design against system | none: correct only if what derives from it keeps passing |
| Cost changes shape | a crash: cheap, dangerous in volume | rework: a quarter pointed wrong | a bias: nothing fails, everything derived leans the same way |
| Excess changes shape | a comment restating its code | a design restating its contract | a rule nobody can name a violation of |
