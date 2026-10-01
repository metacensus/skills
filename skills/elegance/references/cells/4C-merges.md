# 4C · Merges

Tier 4 [**Module**](../scope.md) · [**Past**](../time.md) · above [3C release](3C-release.md) · below [5C commit](5C-commit.md) · across [4A plan](4A-plan.md), [4B surface](4B-surface.md).

## Example

The pull requests, open for decision or merged, each naming the item it closed and where it deviated from the plan.

## Location

**Git/History**, in the [location key](../grid.md#location-key).

## Clear when

Before merge, the reviewer can decide without asking: the body says why, or links the item that does, and names what approving commits to, each decision it needs, and what nobody checked. After merge, it names the item it closed and the deviation it records is what the diff did; the record is immutable, so only the link and the closing status can be missing.

## Excess

- **A pull request body that narrates the commits.** The commits are listed beneath it. Test: hide the commit list and read the body — a line that only names what a commit already says goes.
- **A summary that restates the item.** Link the item; write only the deviation. Test: replace the summary with a link to the item — keep only the deviation the diff made.
- **A testing section reciting the gate.** The gate ran; its record is the check.
- **Screenshots and walkthroughs of what the diff shows.** Keep one where the diff cannot show it — rendered output — and none otherwise.
- **Asks scattered through narrative.** Number every decision in one place and mark which block the merge. Test: could the reviewer list what is asked of them without reading the rest?
- **What outlives the merge.** Follow-ups, known gaps, and work asked of someone else go to an item the body links; the body freezes at merge and nothing tracks it.
- **The author's receipts.** Self-review findings, provenance, conventions followed. A convention knowingly bent gets one line, where the reviewer would otherwise read it as a mistake.
- **Length standing in for scope.** A body that must be long to be understood marks a change too big to review; split the change.

## Cost

The reviewer approves without having seen the decision. The parent cannot close honestly, and learnings do not roll up.

## Moves

Immutable once merged, so alter before: rewrite each answered ask as its outcome. Link both ways, item to merge and merge to item, and record the closing status on the parent. A choice made from experience cites the experience by name, so the reason is an edge rather than prose.
