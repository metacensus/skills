> A merge record is read to decide before the merge and to trace after it: it names the item it closed and only the deviation the diff made.

```
        3C release
            ↑
4A plan ↔ 4B surface ↔ 4C merges
            ↓
        5C commit
```

Tier 4 · scope Module · time Past

## Example

The pull requests, open or merged, each naming the item closed · where it deviated from the plan.

## Location

**Git/History**, in the location key (grid).

## Clear when

Before merge → body says why, or links the item · names what approving commits to · numbers each decision · says what nobody checked → reviewer decides without asking

After merge → item closed is named · deviation is what the diff did · only the link and closing status can be missing (the record is immutable)

## Excess

| Excess | Test or move |
|---|---|
| **A pull request body that narrates the commits** | Hide the commit list and read the body; a line that only names what a commit says → goes. |
| **A summary that restates the item** | Replace it with a link; keep only the deviation the diff made. |
| **A testing section reciting the gate** | The gate ran; its record is the check → cut. |
| **Screenshots and walkthroughs of what the diff shows** | Keep one only where the diff cannot show it (rendered output). |
| **Asks scattered through narrative** | Number every decision in one place, mark which block the merge. Could the reviewer list the asks without reading the rest? |
| **What outlives the merge** | Follow-ups, known gaps, work for others → an item the body links; the body freezes at merge. |
| **The author's receipts** | Self-review findings, provenance, conventions followed → cut. A convention knowingly bent gets one line. |
| **Length standing in for scope** | A body that must be long to be understood marks a change too big; split where each half merges alone. |

## Cost

The reviewer approves without having seen the decision · the parent cannot close honestly · learnings do not roll up.

## Moves

Immutable once merged, so alter before.

1. Rewrite each answered ask as its outcome → link both ways (item ↔ merge) → record the closing status on the parent
2. A choice made from experience → cite the experience by name, so the reason is an edge, not prose
