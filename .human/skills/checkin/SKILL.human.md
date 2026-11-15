> Before anything goes back into a shared repo, ten checks keep the diff from causing structural drift.

Fires: before any commit, push, or PR; "check in", "put this back".

```
1 Branch → 2 Precedent → 3 Derived → 4 Falsified → 5 Surgical → 6 Gate → 7 Settle → 8 Diff → 9 Text → 10 ⛔ Stop
```

The gate catches broken builds. These checks catch drift: reformatted files, duplicated derived state, invented conventions.

## 1. Branch — never the default branch

```
when HEAD = default branch → branch first
name: <your-name>/<topic>      e.g. alex/retry-backoff
when name off-shape        → git branch -m before pushing
```

| Name part | Holds | Not |
|---|---|---|
| owner | whom to ask about a stale branch | |
| topic | the change's subject | ticket, tool |

## 2. Match precedent before you invent

```
new record, field, or file → find 2-3 siblings → copy their shape, key by key
when yours differs from every precedent → change yours
```

⚠️ Schema-valid is not conventional.

## 3. Never author derived state

| Do not write | Example |
|---|---|
| what the system computes | counts, indices, contents lists, claims over a set |
| a fact a later edit falsifies | "the first X in Y"; a date restated beside its field |

Write each fact once, in its field, in the present tense.

## 4. Check what else your edit made false

```
edit a record → grep the entity → re-read every reference against the change
```

⚠️ Sibling prose goes false while every check passes.

## 5. Keep the diff surgical

| Do | Do not |
|---|---|
| change only the lines needed | reformat or re-serialize a whole file |
| restore encoding, line endings, order if a tool rewrote them | commit the rewrite |
| PR onto someone's branch: your edits only | fold in a rebase or merge of their base; offer it as its own branch |

## 6. Run the gate

```
run the repo's gate locally, even when CI repeats it
when it fails → read the rule it names before working around it
```

## 7. Ask what settles what you altered

| When | Run | Then |
|---|---|---|
| repo has `elegance-mapping.md` | `node ${CLAUDE_PLUGIN_ROOT}/scripts/check-cells.mts --diff` | do what it prints, even when sure |
| repo is public (`gh repo view --json visibility`) | the [`open-source`](../open-source/SKILL.human.md) review | over the change |

Paths decide the review because authors judge their own work worst.

## 8. Read your own diff

`git --no-pager diff`, every line, as a reviewer.

| Ask | ✅ |
|---|---|
| Line count proportional to the change described? | ⬜ |
| Did anything move that did not need to? | ⬜ |
| Any file you did not mean to touch? | ⬜ |
| Is every behavior change tested? | ⬜ |

## 9. Commit and PR text

| Text | Matches | Ends with |
|---|---|---|
| commit | `git log` style; [5C](../elegance/references/cells/5C-commit.human.md) | session's attribution lines |
| PR body | [4C](../elegance/references/cells/4C-merges.human.md) | session's attribution lines |

## 10. Stop at a verified diff

```
change → verify → show diff → ⛔ stop
```

Commit, push, and PR are the user's call, unless they handed you the branch.
