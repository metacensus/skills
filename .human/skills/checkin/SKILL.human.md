> Ten checks before anything goes back into a shared repo, so the diff causes no structural drift.

Fires: before any commit, push, or PR; "check in", "put this back".

```
Branch → Precedent → Derived → Falsified → Surgical → Gate → Settle → Diff → Text → ⛔ Stop
```

## Branch

On the default branch, branch first: `<your-name>/<topic>`.

## Precedent

Copy 2-3 siblings, key by key. ⚠️ Schema-valid is not conventional.

## Derived

Write no computed or falsifiable fact; each fact once.

## Falsified

Grep the entity; re-read every reference.

## Surgical

| Do | Not |
|---|---|
| change needed lines | reformat a file |

## Gate

Run it locally; read the rule a failure names.

## Settle

| When | Run |
|---|---|
| `elegance-mapping.md` | `check-cells.mts --diff` |
| public repo | [`open-source`](../open-source/SKILL.human.md) |

## Diff

Read `git --no-pager diff` as a reviewer.

## Text

Commit: [5C](../elegance/references/cells/5C-commit.human.md). PR: [4C](../elegance/references/cells/4C-merges.human.md).

## Stop

Verify, show the diff, ⛔ stop; commit and push are the user's.
