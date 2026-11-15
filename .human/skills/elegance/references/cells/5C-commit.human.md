> A commit says what changed in one line and why in the body, and the body tells the reader only what the diff cannot.

```
            4C merges
                ↑
5A criteria ↔ 5B code ↔ 5C commit
```

Tier 5 · scope File · time Past

Links: [4C merges](4C-merges.human.md) · [5A criteria](5A-criteria.human.md) · [5B code](5B-code.human.md)

## Example

The commit and its message.

## Location

**Git/History**, in the location key (grid).

## Clear when

One line says what changed → body, if any, says only why · the diff shows the what · the message adds the one thing it cannot

## Excess

| Excess | Test or move |
|---|---|
| **A body that walks the diff** | Hide the diff and read the message; a line that only tells you what the diff shows goes. |
| **A subject that summarizes and a body that summarizes again** | One goes. |
| **The reasoning in full** | Alternatives weighed live in the item or pull request; the commit names the choice and links. |
| **Everything 4C names, at the commit** | See [4C merges](4C-merges.human.md). |

## Cost

History that cannot be scanned · blame that returns prose, not a reason.

## Moves

A commit is immutable once made.

1. ✏️ Alter before committing
2. One line for what
3. Why only where the diff cannot show it
4. A link for everything else
