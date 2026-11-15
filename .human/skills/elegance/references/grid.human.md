> Scope × time gives every node one cell of six tiers by three stations. A cell is named for what it holds, not its coordinate.

Tier ([scope](scope.human.md)) + station ([time](time.human.md)) → `3A` → `cells/3A-design.md`.

## Reading the grid

```
cell   → one tier up, same station: its summary
       → one tier down: derives from it
file you are editing → check-cells.mts --diff → location table → cell
```

Every cell file has six headings: **Example**, **Location**, **Clear when** (the reader's test), **Excess** (the hunt list), **Cost**, **Moves**. A cell holds only its own; link, never copy.

## Table 3 — The grid, with examples and locations

| Tier \ Station | A · Future | B · Current | C · Past |
|---|---|---|---|
| 0 | proposal `[Proposals]` | rules `[Org Docs]` | retired rules `[Archive]` |
| 1 | vision `[Org Docs]` | problem `[Org Docs]` | field history `[Archive]` |
| 2 | roadmap `[Roadmap]` | identity `[Org Docs]` | org history `[Archive]` |
| 3 | design `[Design Docs]` | contract `[Project API/Docs]` | release `[Changelog]` |
| 4 | plan `[Git/Issues]` | surface `[Package API]` | merges `[Git/History]` |
| 5 | criteria `[Git/Issues]` | code `[Code]` | commit `[Git/History]` |

Each location maps to a place in `elegance-mapping.md`.

## Where the grid collapses

Tiers 5 and 0 blur stations: A and B are rarely written apart. Tiers 2 to 4 are fully two-dimensional, where organizations most often have a gap.

## Location key

Enforcement grades incorrectness only ([§3.1](theory.human.md#31-drift)); nothing refuses excess.

- `gate`, refuses a wrong state itself: Code
- `partial`, gates one half: Project API/Docs · Package API · Git/History
- `described`, refuses nothing: Org Docs · Proposals · Roadmap · Design Docs · Git/Issues · Changelog · Archive

⬜ Where a location does not gate, a second reader is the check; `check-cells.mts --diff` names those locations. A path settles a location, not a station: it over-fires by design.
