A scanner that flags one repository's drift by class, naming what each class asks and changing nothing; only a miss is a failure.

## What you get

The repository, its boards and their purposes, the label names, required fields, cadence, and the classes to flag.

## What you do

Read every open issue in scope, the last comment of each, and, through `sdlc-status`, every card on the repository's issues; flag only orphans, misparented, done-but-open, closed-parent, stale, mislabeled `ready`, board drift, misplaced cards, issues a board's purpose holds that have no card, missing priorities, or inherited fields with a proposed value, work blocking a Publish that a work blocker ships after, or a Publish blocker does not precede, in one repository, with the Publish that would hold, an Epic blocking a Publish or Release that one of its children waits on, with the other children its edge would move to, agents' escalations or stops nobody answered, blocked-by cycles, merged branches, issues in an archived or the wrong repository, duplicates, stale PRs, Initiatives boarded without a row, and, closed ones too, unowned and untyped issues, private names in public text, Owed steps not done, `ready` or `designed` on closed issues, settled mapping Holes, follow-ups no issue holds, and boxes left unchecked at a close.

## Report

One flag per line, then a count of what it read, the root issues, and any short read.
