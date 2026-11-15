> `sdlc-mapping.md` binds the [lifecycle](../SKILL.human.md) to one organization, as tables whose rows default.

Fires: writing or auditing a mapping, or reading one to learn how a board, label or role is set.

Key: `—` empty cell · `Hole` undecided: its row takes the default and is reported, never filled · → then

Example, a filled mapping:

```markdown
**Boards**
| Board  | Initiatives | Purpose  |
|--------|-------------|----------|
| acme/3 | acme/api#7  | API work |
| acme/1 | —           | default  |

**Cadence**
| Threshold | Value |
|-----------|-------|
| stale     | Hole  |
```

The rule it follows, read in this order:

Project root mapping → organization's, filling gaps → defaults

| Section | Columns | Where absent |
|---|---|---|
| `## Labels` | Role, Label, Description | each [role](../SKILL.human.md#mechanisms) under its own name |
| `## Boards` | Board `OWNER/N`; Initiatives `OWNER/REPO#N` spaced, `—` = default board; Purpose | no board |
| `## Priority` | Board, Value, Meaning | value means only its order |
| `## Inherited fields` | Field (single-select), Boards `OWNER/N` spaced | no board field inherits |
| `## Status` | Status, Column (`—` archives the card) | column named for its [status](../SKILL.human.md#status) |
| `## Roles` | Role, Who | the [defaults](../SKILL.human.md#roles) |
| `## Checks` | Stage, Paths, Check | the stage's own checks only |
| `## Cadence` | Threshold, Value | `sweep` 7 days · `stale` 14 days idle · `backlog` 90 days in Backlog |

- Agents read both mappings whole, each within 600 words.
- Only the `sdlc-*` scripts, which take one, may parse them.
- None in the repo → ask the user where the org's is; private: `gh api repos/<owner>/<name>/contents/<path>`.
