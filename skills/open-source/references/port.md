# port

## What is in scope

The sources the request lists, by path in the private repository. A file a source links to is out of scope until the user lists it. A source named loosely ("the testing docs") is resolved to paths, and the list goes to the user before anything is copied.

## Order

1. **List** — the sources, one per line in session scratch; the map's left column.
2. **Copy** — each source whole, file for file, into the destination: its sections, its split into files and its references kept, names kept but for the destination's case convention. Files only, never history: no merge, subtree or cherry-pick brings the private repository's commits along. The copy is staged and not committed.
3. **Strip** — [review's order](review.md#order) over the staged copy, every line of it counted as added, its Licensing step always run since the code comes from elsewhere. A span a lead reaches is replaced, by an example from an unrelated domain where the passage teaches through it, and cut only where nothing teaches. `git diff` then shows the strip alone, against the staged copy. Leads read the working tree, and the stripped files are staged over the copy before the commit; the index as copied is never committed. Paths are text too: a lead that reaches a file name renames it at the destination and in the map.
4. **Map** — one row per source: its path, its destination's, and what the strip cut, as a kind ("an internal reference"), never the span.

## What the strip leaves alone

Everything no lead reaches. Shortening, merging files, renaming beyond case and rewording are later changes, after the port lands; a port that also edits hides the edit inside the strip.

## Where the map goes

In the pull request body, where the reviewer reads the sources beside the diff. It is host text, so review's leads read it too. It names source paths relative to their repository and never the repository, which [the hub](../../sdlc/SKILL.md#stages) keeps to private comments; the reviewer's [brief](../../parallelize/SKILL.md#the-brief) or [handoff](../../sdlc/references/handoff.md) names it.
