---
name: land
description: Carry a pull request from its review's pass to merged and released — waiting on CI and background agents without sleeping, merging a stack in order, recovering a refused merge, cutting a release. Trigger when waiting on a run, a check, or a background agent; when merging a PR or a stack; when a merge is refused; and when tagging, rerunning, or verifying a release.
---

Landing ends when what merged is published and its consumers run it. Syncing a branch is [`checkin`'s Sync](../checkin/SKILL.md#6-sync-with-main); first-publish order is [`dev-ci-github`'s](../dev-ci-github/SKILL.md#release-from-a-tag).

## 1. Wait without sleeping

A foreground `sleep` is blocked, and looking by hand spends a turn per look. Wait on a command that exits when the condition holds, under `run_in_background`, which re-invokes on exit: `gh pr checks N --watch`, `gh run watch RUN --exit-status`, or an `until` loop over `gh api` at 30s or more. `Monitor` serves when each check's result is wanted as it lands.

- **The loop exits on every terminal state**, failure and cancel among them: silence is not success.
- **Stall watchdog**: it also exits once nothing has moved for about twice the run's usual length, naming what stalled. A run queued with no step output goes to [Where CI stops](../dev-ci-github/SKILL.md#where-ci-stops).
- **A background agent notifies** when it finishes; its output is not polled, only checked by the watchdog past its bound.

## 2. Merge a stack in order

Bottom first: a child merges after its parent, never into the parent's branch.

- **Retarget** once the parent merges: `gh pr edit N --base <default>`, confirmed by `gh pr view N --json baseRefName`. GitHub retargets it only when the parent's branch is deleted.
- **Sync** per `checkin`. A squashed parent leaves its commits on the child; a rebase drops them: `git rebase --onto origin/<default> <parent's last commit>`.
- **Wait** for CI to rerun on the new base, then merge the next.

## 3. A refused merge

| The refusal says | Cause | Then |
|---|---|---|
| a required check is pending or failing | CI is not green | wait, or fix |
| the head branch is behind | protection requires an up-to-date branch | [`checkin`'s Sync](../checkin/SKILL.md#6-sync-with-main), then wait |
| a review is required | protection requires an approval | the mapping's `reviewer`; never self-approve |
| auto-merge is not allowed | the repository turned it off | merge once green, per [Where CI stops](../dev-ci-github/SKILL.md#where-ci-stops) |
| the merge method is not allowed | the repository allows others | `gh api repos/O/R --jq '[.allow_squash_merge,.allow_merge_commit,.allow_rebase_merge]'`, then an allowed one |
| a repository rule is violated | a ruleset | `gh api repos/O/R/rules/branches/<default>` names it: meet it, or hand it to an admin |
| `gh pr merge` hits a GraphQL limit while `gh api rate_limit` shows room | GraphQL's own limit | REST: `gh api -X PUT repos/O/R/pulls/N/merge -f merge_method=squash` |
| the agent's environment refuses the command | policy: the merge is a person's | hand them the one command per [`operator-runbook`](../operator-runbook/SKILL.md); never route around it through REST, `--admin`, or another identity |
| nothing: a merge landed on `<default>` by mistake | no refusal stopped it | revert it in a PR of its own, `git revert -m 1 <merge commit>` (a squash needs no `-m`); never force-push `<default>` |

## 4. Release

- **Tag** as [Release from a tag](../dev-ci-github/SKILL.md#release-from-a-tag) says, the first release only once its first-publish order holds; wait on the run.
- **A transient failure** (runner, registry 5xx, rate limit) reruns: `gh run rerun RUN --failed`. One a commit fixes merges the fix and cuts the next patch; a published tag never moves.
- **Publish is verified at the registry**, not the run: `npm view PKG@VER version`, `docker buildx imagetools inspect IMAGE:TAG`, `gh release view vX.Y.Z`.
- **Each consumer that pins it** (a dependency, an image tag or digest, a submodule) bumps in a PR of its own, carried through `checkin`, done when its CI passes.

## 5. Done

One line per PR merged and per version published, each linked.
