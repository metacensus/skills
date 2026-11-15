> An issue goes from request to `ready` in four stages; only the delegator, or a delegate named in the remit, may mark it `ready`.

Fires: filing, composing, or curating an issue; asked whether an issue is ready.

```
Compose → File → Curate → ready
   ↑        ↑
   └ Decompose (Epic: one Compose + File per child)
```

Stage names follow the [`sdlc`](../sdlc/SKILL.human.md) hub's [protocol](../sdlc/SKILL.human.md#stages), as its [mapping](../sdlc/SKILL.human.md#the-mapping) renames them.

## Compose

| Check | Rule |
|---|---|
| Type | on the [ladder](../sdlc/SKILL.human.md#the-ladder); ⛔ Initiative or Epic escalates to the [`delegator`](../sdlc/SKILL.human.md#roles) unless the remit hands it down |
| Parent | Initiative · none; Epic → Initiative; Task or Bug → Epic |
| Repository | Epic → where most of its work lands; Initiative → one the delegator names, else the mapping's suggested home |
| Form | the required fields of its type's form |
| Bar | the ladder's, per type; a Spike's decision is its criterion |

No issue exists yet, so the comment goes to the user.

## Decompose

An Epic's children follow the 4A plan.

1. Compose each child.
2. File each, blockers before what they block: `--parent` the Epic, `--blocked-by` each blocker.
3. File all children before Curating any.

⚠️ Work found mid-execution is its own Compose under the Epic it serves, never folded into a sibling.

## File

```bash
gh issue create -R OWNER/REPO --type T --parent P --title "…" --body-file BODY
```

| Flag or step | When |
|---|---|
| `--type` | inside an organization only |
| `--blocked-by N` | a stated blocker |
| `--project` | the [board](../sdlc/SKILL.human.md#mechanisms) holding its Initiative |
| then [`sdlc-status --apply`](../sdlc/SKILL.human.md#status) | always |
| `gh issue edit P --add-sub-issue N` | a new parent's existing children |

No label.

## Curate

Applies to any issue without `ready`: rerun Compose's checks.

| Who | Pass | Otherwise |
|---|---|---|
| Delegator, or delegate whose [remit](../sdlc/SKILL.human.md#roles) names it | apply `ready`, plus `designed` if the body settles every choice; then [`sdlc-status --apply`](../sdlc/SKILL.human.md#status) | post the comment |
| Anyone else | ⛔ escalate the pass | post the comment |

Pickup is the hub's [Ready](../sdlc/SKILL.human.md#status) row.
