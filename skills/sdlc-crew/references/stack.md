# Stack

A child whose open blockers each have an open PR may start on their branch, its own PR based on theirs, when nothing still pending on them, a person's choice or a contract [Plan](../SKILL.md#plan) merges first, reaches what it uses. [`sdlc-author`'s Precheck](../../sdlc-author/SKILL.md#precheck) takes it as unblocked; a base whose review stops, or that closes unmerged, parks it as Blocked.

A stack merges bottom first, a child after its parent and never into the parent's branch. Once the parent merges, the child retargets, `gh pr edit N --base <default>` confirmed by `gh pr view N --json baseRefName`, since GitHub retargets it only when the parent's branch is deleted. It then [syncs](../../sdlc-author/SKILL.md#sync), an unreviewed child free to drop a squashed parent's commits instead (`git rebase --onto origin/<default> <parent's last commit>`), and merges once CI reruns on the new base.
