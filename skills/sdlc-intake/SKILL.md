---
name: sdlc-intake
description: Carries an issue from a request to `ready` in three stages of the `sdlc` lifecycle. Trigger when filing, composing, or curating an issue, and when asking whether an issue is ready.
---

Each stage follows the [`sdlc`](../sdlc/SKILL.md) hub's [protocol](../sdlc/SKILL.md#stages). Read the [mapping](../sdlc/SKILL.md#the-mapping) first: every label, board, column, and role below is the one it names.

## Compose

Draft the issue against these checks:

- **Type** on the [ladder](../sdlc/SKILL.md#the-ladder): a question to settle first is a Spike, and work that wants children an Epic. Epics are the `lead`'s to file.
- **Parent**: the Epic it serves, or none at the root.
- **Repository**: where its PR lands, as the ladder says; an Epic's is the mapping's Epics column.
- **Form**: the required fields of its type's [form](../sdlc/forms/).
- **Bar**: [4A](../elegance/references/cells/4A-plan.md) for an Epic, [5A](../elegance/references/cells/5A-criteria.md) otherwise, a Spike's decision standing as its criterion.

No issue exists yet, so Compose's comment goes to the user; a pause is their confirming the draft.

## File

```bash
gh issue create -R OWNER/REPO --type T --parent P --title "…" --body-file BODY
```

Add `--blocked-by N` for a stated blocker and `--project` for the board the mapping names for the repository, its card in Backlog's column. No label. Existing children of a new Epic attach with `gh issue edit EPIC --add-sub-issue N`, which create cannot do. The issue is File's record; it posts no comment.

## Curate

Anyone curating an unlabeled issue runs this stage alone: Compose's checks, against the issue as filed.

- **Pass**: apply `ready`, and move its card to Ready's column. The label is the record.
- **Otherwise**: post the comment, each unchecked line saying what is missing, and leave the issue unlabeled.

`ready` is the issue's `owner`'s or the `lead`'s to apply, within the hub's [may/propose table](../sdlc/SKILL.md#roles); anyone else posts a pass as a proposal. Pickup is the hub's [Ready](../sdlc/SKILL.md#status) row.
