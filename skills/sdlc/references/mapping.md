# The mapping

`sdlc-mapping.md` binds the [lifecycle](../SKILL.md) to an organization, beside its other mappings. A project may keep its own at its root, read first, the organization's filling what it lacks. Its sections are tables, defaulting per row:

| Section | Columns | Where absent |
|---|---|---|
| `## Labels` | Role, Label, Description | each [role](../SKILL.md#mechanisms) under its own name, described as there |
| `## Repositories` | Repository as `OWNER/REPO`, Board as space-separated `OWNER/N` open to its issues, Epics | no board; Epics file in the repository itself |
| `## Status` | Status, Column (`—`: no card move) | each column named for its status |
| `## Roles` | Role, Who | the [defaults](../SKILL.md#roles) |
| `## Checks` | Stage, Paths, Check | the stage's own checks only |
| `## Cadence` | Threshold, Value | `sweep` every 7 days; `stale` after 14 days without activity; `backlog` after 90 days in Backlog |

- A cell containing `Hole` is undecided: its row takes the default, and it is reported, never filled. `—` is an empty cell.
- Agents read both whole, within 600 words each; no tool but `sdlc-setup.sh`, which takes one, may parse them.
- If the repository has none, ask the user where the organization's is; read a private one with `gh api repos/<owner>/<name>/contents/<path>`.
