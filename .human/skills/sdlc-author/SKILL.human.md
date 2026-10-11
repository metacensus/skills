The author's stages, from picking up an issue to an open pull request, each run in the `sdlc` hub's protocol. A stage fixes what it can, even in an earlier stage's work, before it reports.

## Precheck

Pick up a Ready issue, or resume one already yours; its parent is open and its board card, if any, current. Pause on a fix only the owner can make; stop on work that is another's, blocked, or under a closed parent.

## Design

Settle and list the open choices, and hold the issue to its bar. Passing applies `designed`. Pause on the user's choice; stop on an issue below its bar.

## Implement

Assign yourself and move the card; branch and link. `elegance` throughout, `parallelize` for work too large for one agent. Pause when the design or requirements shift; stop when a criterion cannot be met or the parent must change.

## Self-review

Draft the PR body; run the `elegance-review` agent, and in a public repository the `open-source` review; run the issue's Verification and the gate. Pause on a disputed span or a leak already pushed; stop when the Verification cannot pass.

## Publish

`checkin`, push once the user agrees or has handed over the branch, open the PR closing the issue, request the mapping's reviewers, and move to In review.
