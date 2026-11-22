---
name: sdlc-author
description: Carry an issue from pickup to closed, and any change in a shared repository from its first edit to merged. Trigger when picking up, starting, working, finishing, or landing an issue, when answering its review, and when asking what work is ready to start; before the first edit of a change, and before any commit, push or pull request; when waiting on CI or a background agent; and when merging a PR or a stack, or a merge is refused.
---

The author's stages, each run as [the hub's protocol](../sdlc/SKILL.md#stages) says, the mapping's Checks rows included. A stage fixes what it can before it reports, in an earlier stage's work if that is where the fix lies. A change with no issue runs Implement, Self-review and Open's checks, and stops where Open escalates.

## Precheck

Ready work: [the hub's query](../sdlc/SKILL.md#status).

- Its body carries its form's required fields.
- Its [derived status](../sdlc/SKILL.md#status) is Ready, Blocked only on [stacked](../sdlc-crew/SKILL.md#stack) blockers, or In progress assigned to the acting identity, `gh api user --jq .login`.
- Every `blocked by` is closed or, [stacked](../sdlc-crew/SKILL.md#stack), In review; its parent is open.
- A blocker typed Publish, Release or Rollout is read by title and state alone; its blockers are never walked.
- A Task that bumps a dependency, an image or a submodule to a version a [Publish](../sdlc/SKILL.md#mechanisms) carries is blocked by that Publish, the edge added where missing.
- Its card, if any, sits in its status's column, then [`sdlc-status --apply`](../sdlc/SKILL.md#status).

**Pass** goes to Design, or to Implement on an issue carrying `designed`. **Escalate** on a fix the author may not [make](../sdlc/SKILL.md#roles), such as a missing field in another's body, which is the delegator's [Frame](../sdlc/SKILL.md#phases), or on a version to adopt that no Publish carries and no registry serves. **Stop** when it is assigned to another, blocked but not stacked, under a closed parent, or past In progress.

## Design

- The body is written for a person: scoped, summarized, explained.
- The comment proposes a design for what the body leaves open.
- The issue meets the bar [the ladder](../sdlc/SKILL.md#the-ladder) names for its type.

**Escalate** until the delegator applies `designed`. **Stop** when the issue fails its bar.

## Implement

- Status is In progress: assign the acting identity, then [`sdlc-status --apply`](../sdlc/SKILL.md#status).
- The branch is cut from `origin/<default>` (`gh repo view --json defaultBranchRef`) after `git fetch origin`, never from the local default branch, which is as old as its last pull: a change cut from a stale base is reviewed against code that no longer exists. A branch resumed rather than cut [syncs](#sync) before the first edit.
- It is named `<your-name>/<topic>`, `alex/retry-backoff`: the owner prefix says whom to ask about a stale branch, and the topic names the change's subject rather than a ticket or the tool that made it. An environment that pushes only under a fixed prefix (`claude/…`) keeps that prefix, the topic after it. A harness-assigned name is renamed (`git branch -m`) before the first push.
- It has a worktree of its own: `git worktree add <path> -b <branch> origin/<default>`. A worktree the harness made is checked: `git rev-list --count HEAD..origin/<default>` is 0, or it [syncs](#sync).
- Commands run from the worktree root with absolute paths, never in another checkout, the main one among them. The stash stack is shared across worktrees: work set aside goes in a WIP commit, not `git stash`.
- [`elegance`](../elegance/SKILL.md) governs every line written.
- Work too large for one agent goes to [`parallelize`](../parallelize/SKILL.md), answered: units are the design's pieces, edges the contracts it settled, the action is to build each, done is its criteria and the gate, checks are `elegance`.

**Escalate** when the design or requirements shift, or new context calls the work into question. **Stop** when a criterion cannot be met, or the parent must change.

## Self-review

- The branch [syncs](#sync), so what follows runs on what will merge.
- The issue's Verification block exits 0, and so does the repository's gate, run locally even where CI repeats it. A failure that names a rule is read before it is worked around.
- Where the repository has an `elegance-mapping.md`, `node ${CLAUDE_PLUGIN_ROOT}/scripts/check-cells.mts --diff` is read as [`elegance`'s Before you finish](../elegance/SKILL.md#before-you-finish) says: an unexpected cell is an alteration to undo.
- In a public repository, [`dev-ci-github`'s pre-push check](../dev-ci-github/SKILL.md#before-a-public-push) passes before the push.

**Escalate** on a secret in pushed history. **Stop** when the Verification block cannot pass as written.

## Open

- The branch is not the default, and is named per [Implement](#implement).
- Each new record, field or file copies the exact shape of two or three siblings that solved the same problem, key by key: schema-valid is not conventional.
- Nothing derived is authored: neither what the system computes (counts, indices, lists of contents, claims over a set) nor a fact a later edit would falsify, such as "the first X in Y" or a date restated beside its field. Each fact is written once, in its field, in the present tense.
- Whatever else references an edited entity is grepped and re-read against the change.
- The diff is surgical: only the lines the change needs, no file reformatted or re-serialized, and encoding, line endings and order restored where a tool rewrote them. A PR onto another's branch carries only its own edits, a rebase or merge of their base offered as a branch of its own.
- `git --no-pager diff` is read, every line, as another's: its line count is proportional to the change, additions net of removals (`git diff --shortstat origin/<default>...HEAD`) match it, and one that only adds where it could replace says why; nothing moved that need not; no file is in it unmeant; every behavior change is tested.
- Commits match `git log` and answer to [5C](../elegance/references/cells/5C-commit.md); the PR body is drafted to [4C](../elegance/references/cells/4C-merges.md) and describes only `git diff origin/<default>...HEAD`. Both end with the session's attribution lines.
- The branch is [linked](../sdlc/SKILL.md#linking-an-issue-to-its-branch-and-pr), then pushed.
- `gh pr create` opens the PR with the drafted body and `Closes #N`. One opened before its diff is verified is a draft (`--draft`) until `gh pr ready`: [review stops on a draft](../sdlc-review/SKILL.md#precheck).
- The reviewers the remit names are requested.
- Where the work blocks a [Publish](../sdlc/SKILL.md#mechanisms) itself, not through its Epic, it blocks the earliest open Publish that holds, filing the next version when none does: a blocker that is work ships in that Publish or an earlier one, and a blocker that is a Publish is strictly earlier. Versions compare only within one repository; across repositories their Release orders them. Where its own change moves it to a later Publish, the work it blocks moves too.
- Status is In review, then [`sdlc-status --apply`](../sdlc/SKILL.md#status).

**Escalate** before the first commit or push, unless the remit hands over the branch, and on moving work that is not the author's.

## Respond

- Each finding of [the review](../sdlc-review/SKILL.md) is applied or declined, in [the review loop](../elegance/SKILL.md#the-review-loop).
- The reply on the PR lists which, and why.
- The Verification block and the gate exit 0 on the new head.

**Escalate** on a span disputed at the loop's cap. **Stop** on a finding that reopens the design or a criterion.

## Land

- The PR merges on the review's pass, [waiting](#waiting) without sleeping and recovering [a refused merge](#a-refused-merge).
- A stack merges bottom first, a child after its parent and never into the parent's branch. Once the parent merges, the child retargets, `gh pr edit N --base <default>` confirmed by `gh pr view N --json baseRefName`, since GitHub retargets it only when the parent's branch is deleted. It then [syncs](#sync), an unreviewed child free to drop a squashed parent's commits instead (`git rebase --onto origin/<default> <parent's last commit>`), and merges once CI reruns on the new base.
- Where it ships, it goes out in the Publish it or its Epic blocks, cut under its Release by [`sdlc-ship`](../sdlc-ship/SKILL.md); the author never tags.
- The issue is closed per [the hub's Closing table](../sdlc/SKILL.md#closing).
- Follow-up work is captured through [`sdlc-capture`](../sdlc-capture/SKILL.md).
- Status is Done, then [`sdlc-status --apply`](../sdlc/SKILL.md#status).

**Escalate** the merge where the remit does not reach it, and the close only when `deviated` or **not planned**, before a merge would close it; a plain completion never escalates, and the close goes on to the delegator's [Accept](../sdlc/SKILL.md#phases). The run ends there, and whoever takes the escalation completes Land. **Stop** when the PR cannot merge without reopening a criterion.

## Sync

`git fetch origin`; a branch behind `origin/<default>` brings it in:

- Rebase while the branch is the author's alone and unreviewed; merge once another has pulled it or review has begun, and never force-push over them.
- A conflict in a generated file, a lockfile or generated code, is regenerated, never merged by hand.
- `git diff origin/<default>...HEAD` shows only the change.

## Waiting

A foreground `sleep` is blocked, and looking by hand spends a turn per look. Wait on a command that exits when the condition holds, under `run_in_background`, which re-invokes on exit: `gh pr checks N --watch`, `gh run watch RUN --exit-status`, or an `until` loop over `gh api` at 30s or more. `Monitor` serves when each check's result is wanted as it lands.

- **The loop exits on every terminal state**, failure and cancel among them: silence is not success.
- **Stall watchdog**: it also exits once nothing has moved for about twice the run's usual length, naming what stalled. A run queued with no step output goes to [Where CI stops](../dev-ci-github/SKILL.md#where-ci-stops).
- **A background agent notifies** when it finishes; its output is not polled, only checked by the watchdog past its bound.

## A refused merge

| The refusal says | Cause | Then |
|---|---|---|
| a required check is pending or failing | CI is not green | wait, or fix |
| the head branch is behind | protection requires an up-to-date branch | [Sync](#sync), then wait |
| a review is required | protection requires an approval | the [`reviewer`](../sdlc/SKILL.md#roles); never self-approve |
| auto-merge is not allowed | the repository turned it off | merge once green, per [Where CI stops](../dev-ci-github/SKILL.md#where-ci-stops) |
| the merge method is not allowed | the repository allows others | `gh api repos/O/R --jq '[.allow_squash_merge,.allow_merge_commit,.allow_rebase_merge]'`, then an allowed one |
| a repository rule is violated | a ruleset | `gh api repos/O/R/rules/branches/<default>` names it: meet it, or hand it to an admin |
| `gh pr merge` hits a GraphQL limit while `gh api rate_limit` shows room | GraphQL's own limit | REST: `gh api -X PUT repos/O/R/pulls/N/merge -f merge_method=squash` |
| the agent's environment refuses the command | policy: the merge is a person's | hand them the one command per [`human-steps`' Commands](../human-steps/SKILL.md#commands); never route around it through REST, `--admin`, or another identity |
| none: a merge landed on `<default>` by mistake | — | revert it in a PR of its own: `git revert -m 1 <merge commit>`, `git revert <squash commit>`, or `git revert <first>^..<last>` for a rebase merge; never force-push `<default>` |

## Without a pull request

A Spike goes from Design to Land, and ends at its confirmed `Decision:`. An action Task, a step only a role can take, hands that role the command and its expected output in place of Implement through Respond; its Verification closes it at Land.
