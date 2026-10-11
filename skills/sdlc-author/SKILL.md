---
name: sdlc-author
description: Carry an issue from pickup to an open pull request. Trigger when picking up, starting, working, or finishing an issue, and when asking what work is ready to start.
---

The author's stages, each run as [the hub's protocol](../sdlc/SKILL.md#stages) says, the mapping's Checks rows included. A stage fixes what it can before it reports, in an earlier stage's work if that is where the fix lies.

## Precheck

Ready work: `gh issue list --search 'label:<ready> no:assignee -is:blocked type:Task,Bug'`.

- Its body carries its form's required fields.
- Its [derived status](../sdlc/SKILL.md#status) is Ready, or In progress assigned to the acting identity, `gh api user --jq .login`.
- Every `blocked by` is closed, and its parent is open.
- Its card, if any, sits in its status's column.

**Pause** on a fix the author can only [propose](../sdlc/SKILL.md#roles), such as a missing field in another's body. **Stop** when it is assigned to another, blocked, under a closed parent, or past In progress.

## Design

- Each choice the issue leaves open is settled, and the comment lists it.
- The issue meets the bar [the ladder](../sdlc/SKILL.md#the-ladder) names for its type.

**Pass** applies `designed`; an issue already carrying it skips this stage. **Pause** on a choice that is the user's. **Stop** when the issue fails its bar.

## Implement

- Status is In progress: assign the acting identity, and move the card.
- The branch is [`checkin`'s](../checkin/SKILL.md), linked as [the hub](../sdlc/SKILL.md#linking-an-issue-to-its-branch-and-pr) says.
- [`elegance`](../elegance/SKILL.md) governs every line written.
- Work too large for one agent goes to [`parallelize`](../parallelize/SKILL.md), answered: units are the design's pieces, edges the contracts it settled, the action is to build each, done is its criteria and the gate, review is `elegance`.

**Pause** when the design or requirements shift, or new context calls the work into question. **Stop** when a criterion cannot be met, or the parent must change.

## Self-review

- The PR body is drafted to [4C](../elegance/references/cells/4C-merges.md).
- The [`elegance-review`](../../agents/elegance-review.md) agent has run over the diff and the draft, in [the review loop](../elegance/SKILL.md#the-review-loop); `parallelize` cuts it along Implement's units when large.
- In a public repository, [`open-source`'s review](../open-source/references/review.md) has run.
- The issue's Verification block exits 0, and so does the repository's gate.

**Pause** on a span disputed at the loop's cap, or a finding in pushed history. **Stop** when the Verification block cannot pass as written.

## Publish

- [`checkin`](../checkin/SKILL.md) holds, and the branch is pushed.
- `gh pr create` opens the PR with the drafted body and `Closes #N`.
- The reviewers the mapping's Roles name are requested.
- Status is In review, and the card moves.

**Pause** before the push, unless the user handed over the branch.
