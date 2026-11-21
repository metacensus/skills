# The mapping

`sdlc-mapping.md` binds the [lifecycle](../SKILL.md) to an organization, beside its other mappings. A project may keep its own at its root, read first, the organization's filling what it lacks. Its sections are tables, defaulting per row:

| Section | Columns | Where absent |
|---|---|---|
| `## Labels` | Role, Label, Description | each [role](../SKILL.md#mechanisms) under its own name, described as there |
| `## Boards` | Board as `OWNER/N`, Initiatives as space-separated `OWNER/REPO#N`, `—` for the default board, Purpose | no board |
| `## Priority` | Board, Value, Meaning | each value means only its place in the field's order |
| `## Inherited fields` | Field (single-select), Boards as space-separated `OWNER/N` | no board field inherits |
| `## Status` | Status, Column (`—`: card archived) | each column named for its status |
| `## Roles` | Role, Who | the [defaults](../SKILL.md#roles) |
| `## Checks` | Stage, Paths, Check | the stage's own checks only |
| `## Cadence` | Threshold, Value | `sweep` every 7 days, read by [`sdlc-hygiene`'s schedule](../../sdlc-hygiene/SKILL.md#schedule); `stale` after 14 days without activity; `backlog` after 90 days in Backlog |

- Rows are read as [one parser](../../../scripts/mapping.mts) states: a row with a cell beginning with `Hole` is undecided, takes the default, and is reported, never filled; `—` is an empty cell.
- Agents read both whole, within 600 words each; no tool but the `sdlc-*` scripts, which take one, may parse them.
- If the repository has none, ask the user where the organization's is; read a private one with `gh api repos/<owner>/<name>/contents/<path>`.
