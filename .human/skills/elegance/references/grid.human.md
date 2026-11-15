> Scope × time gives every node one cell of six tiers by three stations. A cell is named for what it holds, not its coordinate.

Which cell is this? Tier (0 Principles · 1 Field · 2 Organization · 3 System · 4 Module · 5 File) + station (A future · B current · C past) → coordinate `3A` → file `cells/3A-design.md`. Axes: [scope](scope.human.md) · [time](time.human.md).

## Reading the grid

```
cell   → one tier up, same station: its summary
       → one tier down, same station: derives from it
       → other stations: what it is read from, what it leaves behind
row    → cells/3?-*.md   (summary: scope)
column → cells/?A-*.md   (summary: time)
file you are editing → check-cells.mts --diff → path → location table → cell
```

Every cell file has the same six headings, in order:

| Heading | Holds |
|---|---|
| Example | one instance at this scope and time |
| Location | where the information belongs |
| Clear when | the reader's test: what must hold to act without more |
| Excess | what saying too much looks like here; the hunt list for author and reviewer |
| Cost | what carrying it costs |
| Moves | the moves that apply here |

- A cell holds only what is its own. Its confidence rung and drift instrument come from the row, the column and the location key: link, never copy.
- `check-cells.mts` holds every cell to this skeleton.
- ⚠️ Excess is the failure seen at every scope: addition ([theory](theory.human.md#31-drift)).

## Table 3 — The grid, with examples and locations

Each entry: cell name · example in brief · `[location]`. Cells are named in plain text; they have no twin.

| Tier \ Station | A · Future | B · Current | C · Past |
|---|---|---|---|
| 0 Principles | 0A proposal · a proposed writing rule, rejected alternatives, who must say yes · `[Proposals]` | 0B rules · how the org writes, what is source of truth, how it decides · `[Org Docs]` | 0C retired rules · a rule once lived by, the handbook that carried it · `[Archive]` |
| 1 Field | 1A vision · the world to bring about, the wider movement · `[Org Docs]` | 1B problem · the problem as it stands, why it persists · `[Org Docs]` | 1C field history · how the field got here · `[Archive]` |
| 2 Organization | 2A roadmap · next initiatives in order, appetites, summed outcome · `[Roadmap]` | 2B identity · what the org is today, who it talks to · `[Org Docs]` | 2C org history · earlier visions, annual reports · `[Archive]` |
| 3 System | 3A design · target architecture, plan within appetite, non-goals · `[Design Docs]` | 3B contract · what the system exposes, how to run and contribute · `[Project API/Docs]` | 3C release · what landed this quarter, what dropped · `[Changelog]` |
| 4 Module | 4A plan · parent item, children, non-goals · `[Git/Issues]` | 4B surface · exports: types, functions, invariants callers rely on · `[Package API]` | 4C merges · PRs open or merged, each naming its item and deviation · `[Git/History]` |
| 5 File | 5A criteria · what the file should contain, acceptance criteria · `[Git/Issues]` | 5B code · the file as it is, the test against it · `[Code]` | 5C commit · the commit and its message · `[Git/History]` |

Each location type maps to a place in the repo's `elegance-mapping.md`, the one file that names an organization.

## Where the grid collapses

| Where | Why |
|---|---|
| Tier 5 | latency near zero: a commitment becomes fact in minutes, so A and B are rarely written apart |
| Tier 0 | a value describes and prescribes the same entity in one sentence |
| Tiers 2 to 4 | fully two-dimensional; where organizations most often have a gap |

## Location key

Where a cell's information belongs, and the strongest confidence rung it offers alone. Enforcement is what tooling reads: `gate` (refuses a wrong state itself) · `partial` (gates one half, describes the other) · `described` (refuses nothing).

- All three grade incorrectness only ([§3.1](theory.human.md#31-drift)). Nothing refuses excess, so every location is owed a reader.
- ⬜ Where a location does not gate, a second reader is the check. `check-cells.mts --diff` names those locations.
- A path settles a location, not a station. The predicate over-fires by design: over-firing costs a fresh context, under-firing costs the defect.

| Location | Enforcement | What it is | How enforced |
|---|---|---|---|
| Org Docs | `described` | mission, principles, vision, handbook | structure and cross-references at build, at best |
| Proposals | `described` | RFCs, proposal docs, discussion threads awaiting a decision | a decision step, or none |
| Roadmap | `described` | roadmaps, objectives, milestones | a review cadence at best |
| Design Docs | `described` | design docs, ADRs, target-state descriptions | reconciled against the system by review |
| Project API/Docs | `partial` | public surface, readme, contributor guide | API checked where generated or typed; docs described |
| Package API | `partial` | a module's exports and what is colocated to explain them | type system and tests where present; else described |
| Code | `gate` | source, tests, schemas, lint, CI | impossible or detectable, by the check |
| Git/Issues | `described` | issues, child items, dependencies, open changes | structure only; no required fields, no transitions |
| Git/History | `partial` | commits, merged changes, releases | record immutable; what a message claims about the diff is described |
| Changelog | `described` | release notes, status reports, what landed | written at release or review time |
| Archive | `described` | superseded docs, retired policies, annual reports | none; read only when history is the question |
