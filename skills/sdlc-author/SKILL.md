---
name: sdlc-author
description: Carry an issue from pickup to closed. Trigger when picking up, starting, working, finishing, or landing an issue, when answering its review, and when asking what work is ready to start.
---

The author's stages, each run as [the hub's protocol](../sdlc/SKILL.md#stages) says, the mapping's Checks rows included. A stage fixes what it can before it reports, in an earlier stage's work if that is where the fix lies.

## Precheck

Ready work: [the hub's query](../sdlc/SKILL.md#status).

- Its body carries its form's required fields.
- Its [derived status](../sdlc/SKILL.md#status) is Ready, or In progress assigned to the acting identity, `gh api user --jq .login`.
- Every `blocked by` is closed, and its parent is open.
- Its card, if any, sits in its status's column.

**Pass** goes to Design, or to Implement on an issue carrying `designed`. **Escalate** on a fix the author can only [propose](../sdlc/SKILL.md#roles), such as a missing field in another's body. **Stop** when it is assigned to another, blocked, under a closed parent, or past In progress.

## Design

- The body is written for a person: scoped, summarized, explained.
- The comment proposes a design for what the body leaves open.
- The issue meets the bar [the ladder](../sdlc/SKILL.md#the-ladder) names for its type.

**Escalate** until `designed` is applied: by a person, or within a remit that covers Design. **Stop** when the issue fails its bar.

## Implement

- Status is In progress: assign the acting identity, and move its card, if any, adding none.
- The branch is [`checkin`'s](../checkin/SKILL.md).
- [`elegance`](../elegance/SKILL.md) governs every line written.
- Work too large for one agent goes to [`parallelize`](../parallelize/SKILL.md), answered: units are the design's pieces, edges the contracts it settled, the action is to build each, done is its criteria and the gate, checks are `elegance`.

**Escalate** when the design or requirements shift, or new context calls the work into question. **Stop** when a criterion cannot be met, or the parent must change.

## Self-review

- The PR body is drafted to [4C](../elegance/references/cells/4C-merges.md).
- The [`elegance-review`](../../agents/elegance-review.md) agent has run over the diff and the draft, in [the review loop](../elegance/SKILL.md#the-review-loop); `parallelize` cuts it along Implement's units when large.
- In a public repository, [`open-source`'s review](../open-source/references/review.md) has run.
- The issue's Verification block exits 0, and so does the repository's gate.

**Escalate** on a span disputed at the loop's cap, or a finding in pushed history. **Stop** when the Verification block cannot pass as written.

## Publish

- [`checkin`](../checkin/SKILL.md) holds, and the branch is [linked](../sdlc/SKILL.md#linking-an-issue-to-its-branch-and-pr), then pushed.
- `gh pr create` opens the PR with the drafted body and `Closes #N`.
- The reviewers the mapping's Roles name are requested.
- Status is In review, and the card moves.

**Escalate** before linking, unless the remit hands over the branch.

## Respond

- Each finding of [the review](../sdlc-review/SKILL.md) is applied or declined, in [the review loop](../elegance/SKILL.md#the-review-loop).
- The reply on the PR lists which, and why.
- The Verification block and the gate exit 0 on the new head.

**Escalate** on a span disputed at the loop's cap. **Stop** on a finding that reopens the design or a criterion.

## Land

- The PR is merged on the review's pass.
- The issue is closed per [the hub's Closing table](../sdlc/SKILL.md#closing).
- Follow-up work is filed through [`sdlc-intake`](../sdlc-intake/SKILL.md).
- Status is Done, and the card moves.

**Escalate** the merge or the close where neither the mapping's Roles nor the remit reach it: the run ends there, and whoever takes the escalation completes Land. **Stop** when the PR cannot merge without reopening a criterion.

## Without a pull request

A Spike goes from Design to Land, and ends at its confirmed `Decision:`. An action Task, a step only a role can take, hands that role the command and its expected output in place of Implement through Respond; its Verification closes it at Land.
