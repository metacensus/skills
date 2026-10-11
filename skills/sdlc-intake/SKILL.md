---
name: sdlc-intake
description: Carries an issue from a request to `ready` in the `sdlc` lifecycle. Trigger when filing, composing, or curating an issue, and when asking whether an issue is ready.
---

Each stage follows the [`sdlc`](../sdlc/SKILL.md) hub's [protocol](../sdlc/SKILL.md#stages), under the names its [mapping](../sdlc/SKILL.md#the-mapping) gives.

## Compose

Draft the issue against these checks:

- **Type** on the [ladder](../sdlc/SKILL.md#the-ladder). Epics are the `lead`'s to file.
- **Parent**: the Epic it serves, if any.
- **Repository**: as the ladder says; an Epic's is the mapping's Epics column.
- **Form**: the required fields of its type's [form](../sdlc/forms/).
- **Bar**: the ladder's for its type, a Spike's decision standing as its criterion.

No issue exists yet, so Compose's comment goes to the user.

## File

```bash
gh issue create -R OWNER/REPO --type T --parent P --title "…" --body-file BODY
```

`--type` only inside an organization. Add `--blocked-by N` for a stated blocker and `--project` for the mapping's board, its card in Backlog's column. No label. A new Epic's existing children attach with `gh issue edit EPIC --add-sub-issue N`. File posts no comment: the issue is its record.

## Curate

Anyone curating an issue without `ready` reruns Compose's checks on it.

- **Pass**: the `owner` or `lead` applies `ready`, with `designed` when the body already settles every choice, and moves its card to Ready's column; anyone else posts the pass as a proposal.
- **Otherwise**: post the comment.

Pickup is the hub's [Ready](../sdlc/SKILL.md#status) row.
