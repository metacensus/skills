---
name: sdlc-capture
description: Record work found outside the current scope as an issue under the parent that owns it, so that parent's carrier picks it up. Trigger when a task turns up work it does not hold, when filing follow-up work or any issue, and when a person picks work to file.
---

Capture runs as [the hub's protocol](../sdlc/SKILL.md#stages) says, under the names its [mapping](../sdlc/SKILL.md#the-mapping) gives. Its calls go by REST where REST serves as GraphQL does, sparing the GraphQL budget `gh issue` and `gh pr` spend, and its writes batch, each call carrying every change it can. It adds work and [`sdlc-hygiene`](../sdlc-hygiene/SKILL.md) keeps the set honest, so a captured issue need not be perfect: placed near its owner, it outlives the session that found it.

## Capture

- **Scope**: work the current issue's criteria hold stays in it, and a ruling on a sibling reaches that sibling, as [`sdlc-crew`'s Land](../sdlc-crew/SKILL.md#land) says; capture takes the rest.
- **Connections**: `gh search issues --repo OWNER/REPO --state open -- …` and `gh search prs` with the same flags, in each repository it could land in. A match takes the new evidence as a comment, and nothing files. A related issue is named in the body, and linked `blocked by` only where one cannot start until the other closes.
- **Type** on the [ladder](../sdlc/SKILL.md#the-ladder): a Task, Bug or Spike. Work wanting an Epic or Initiative escalates to the [`delegator`](../sdlc/SKILL.md#roles).
- **Parent**: the open Epic whose goal it serves, the current issue's first, then one the search found; with none plausible it files without one, for [`sdlc-hygiene`'s Adopt](../sdlc-hygiene/SKILL.md#adopt).
- **Repository**: where its PR would land, as the ladder says.
- **Form**: its type's [form](../sdlc/forms/)'s required fields, the evidence that found it in the body.

## File

In a public repository the draft first passes [`open-source`'s review](../open-source/references/review.md).

```bash
gh issue create -R OWNER/REPO --type T --parent P --title "…" --body-file BODY
```

`--type` only inside an organization. Add `--blocked-by N` for a stated blocker and `--project` for the [board](../sdlc/SKILL.md#mechanisms) that holds its Initiative. `--parent` and `--blocked-by` take a number in `-R`'s repository, else the issue's URL; `--project` takes the board's title and needs the `project` scope: `gh auth refresh -s project`. Then [`sdlc-status --apply`](../sdlc/SKILL.md#status). No label. A new parent's existing children attach in one call, `gh issue edit P --add-sub-issue N,M`.

## Pickup

Filed without `ready` under its parent, it reaches the agent carrying that parent: [`sdlc-crew`'s Land](../sdlc-crew/SKILL.md#land) re-runs Plan over the children unblocked then, framing a captured one at [Frame](../sdlc/SKILL.md#phases), and the filer names it in its return to its own delegator. Under a parent no agent carries, [`sdlc-hygiene`](../sdlc-hygiene/SKILL.md#act)'s missing `ready` raises it.
