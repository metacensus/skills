---
name: sdlc-capture
description: Record work found outside the current scope as an issue, under its parent where that owner is obvious. Trigger when a task turns up work it does not hold, when filing follow-up work or any issue, and when a person picks work to file.
---

Capture runs as [the hub's protocol](../sdlc/SKILL.md#stages) says, under the names its [mapping](../sdlc/SKILL.md#the-mapping) gives. Each call is the one that does the most per unit of its cost, as [`sdlc-hygiene`](../sdlc-hygiene/SKILL.md) chooses its own. It adds work and [`sdlc-hygiene`](../sdlc-hygiene/SKILL.md) keeps the set honest, so a captured issue need not be perfect: filed and findable, it outlives the session that found it.

## Capture

- **Scope**: work the current issue's criteria hold stays in it, and a ruling on a sibling reaches that sibling, as [`sdlc-crew`'s Land](../sdlc-crew/SKILL.md#land) says; capture takes the rest.
- **Connections**: `gh search issues --repo OWNER/REPO --state open -- …` and `gh search prs` with the same flags, in each repository it could land in. A match takes the new evidence as a comment, and nothing files. A related issue is named in the body, and linked `blocked by` only where one cannot start until the other closes.
- **Type** on the [ladder](../sdlc/SKILL.md#the-ladder): a Task, Bug or Spike. Work wanting an Epic or Initiative escalates to the [`delegator`](../sdlc/SKILL.md#roles).
- **Parent**: the open Epic whose goal it serves, only where that owner is obvious. Otherwise it files without one, a normal outcome, for [`sdlc-hygiene`'s Adopt](../sdlc-hygiene/SKILL.md#adopt) to choose its home.
- **Filer**: with parallel sessions, the one carrying the parent files under it, and the others route the work there.
- **Repository**: where its PR would land, as the ladder says. An issue for a third-party repository files only on a person's ask, worded without naming the application that found it, with no type or parent.
- **Form**: the parent's type and Initiative read first, then the issue's own type's [form](../sdlc/forms/): its required fields, a Spike's question and options among them, and the evidence that found it in the body.

## File

When a person picks the work to file, exactly that set files, under the names settled; an addition, or anything touching schema or ontology, goes back to them as a proposal. In a public repository the draft first passes [`open-source`'s review](../open-source/references/review.md). The Connections search runs again just before:

```bash
gh issue create -R OWNER/REPO --type T --parent P --title "…" --body-file BODY
```

`--type` only inside an organization. Add `--blocked-by N` for a stated blocker and `--project` for the [board](../sdlc/SKILL.md#mechanisms) that holds its Initiative. `--parent` and `--blocked-by` take a number in `-R`'s repository, else the issue's URL; `--project` takes the board's title and needs the `project` scope: `gh auth refresh -s project`. Then [`sdlc-status --apply`](../sdlc/SKILL.md#status). No label. A new parent's existing children attach in one call, `gh issue edit P --add-sub-issue N,M`.

## Close-out

Before a run reports done or closes its parent, every follow-up it named, in chat, scratch files, PR bodies or words such as "for future releases", is filed or recorded as dropped, and the run's return lists each with its issue or reason.

## Defer

Deferred work, a criterion, child or gate, moves to an open issue that states the reason and what brings it back; dropped work closes **not planned**, or its criterion is deleted. A criterion's removal is commented on its issue, never a silent rewrite. Whatever still enforces the deferred item, a required check or a default, comes off in the same move. A deferred item is not asked about again. Deferring is [a person's word](../sdlc/SKILL.md#roles).

## Pickup

Filed without `ready` under its parent, it reaches the agent carrying that parent: [`sdlc-crew`'s Land](../sdlc-crew/SKILL.md#land) re-runs Plan over the children unblocked then, framing a captured one at [Frame](../sdlc/SKILL.md#phases). Under a parent no agent carries, [`sdlc-hygiene`](../sdlc-hygiene/SKILL.md#act)'s missing `ready` raises it.
