---
name: sdlc-review
description: Carry a pull request's review from request to verdict. Trigger when reviewing a pull request, when asked for a review or assigned as reviewer, when asking whether a PR is ready to merge, and before a repository goes public.
---

The reviewer's stages, each run as [the hub's protocol](../sdlc/SKILL.md#stages) says, their comments on the pull request. The agents it starts read, and it posts every comment from what they return. It runs in a session that can start agents, never inside one an agent started: a nested agent reports to its parent, not to the session that holds the verdict.

## Precheck

`gh pr view N --json author,isDraft,reviewRequests,closingIssuesReferences` and `gh pr checks N`.

- The acting identity, `gh api user --jq .login`, holds a [remit](../sdlc/SKILL.md#roles) for this review, which the comment cites, or is a requested reviewer or [the `reviewer` role](../sdlc/SKILL.md#roles) and not the PR's author.
- The PR is not a draft.
- It closes an issue whose [derived status](../sdlc/SKILL.md#status) is In review.
- CI has passed.
- It is current with its base, or no section it links to changed there since.

**Escalate** while CI runs, on a review request or closing link the delegator or author can add, and on a linked section its base has since changed. **Stop** on a draft, a review of one's own PR no remit hands over, a closed issue, or failing CI.

## Summarize

Start [`code-review`](../../agents/code-review.md), and with it Focus's agents, in parallel. Post `code-review`'s summary, for a reader who did not write the PR. The author corrects it in reply, reopening Focus, which does not wait.

**Escalate** on a choice the diff and body do not explain. **Stop** on a PR too large to summarize, which [4C](../elegance/references/cells/4C-merges.md) splits.

## Focus

The comment carries `code-review`'s answer to each of [its questions](../../agents/code-review.md#what-you-do). Then the checks, hardest where the answers point:

- [`elegance-review`](../../agents/elegance-review.md) over the diff, title and body.
- In a public repository, [`open-source`'s review](../open-source/references/review.md) over the diff, commits, names and host text: its Secrets, Examples and Licensing run here, and [`open-source-review`](../../agents/open-source-review.md) takes its Leads and Triage.
- The [mapping's](../sdlc/SKILL.md#the-mapping) Checks rows scoped to review.
- The host's reviewer, `/code-review` where one exists.
- The issue's Verification block exits 0 on the PR's head.

The comment is the verdict, posted once every check finishes, to the issue's carrier, whose Land takes it as input. A check that cannot finish is unchecked with its reason, and the verdict cannot pass.

- **Pass** when no finding needs a choice, findings the author can apply as written among them.
- **Escalate** on a finding whose fix is a choice neither the author nor this review's remit owns.
- **Stop** on a finding that reopens the design or a criterion.

A diff that leaves a criterion or a choice the confirmed Design settled, or a finding that shows the Design's premise false, is a deviation, which passes: the verdict names it and applies the mapping's `deviated` label to the issue the PR closes. Wording, link style and a line the body declares are not; the body names those, as 4C says.

The verdict names each `open-source` finding by path and lead, never by its span. By Review the commit is pushed, so a real one escalates, as [review's Fixing](../open-source/references/review.md#fixing) says.

Post it with `gh pr review N --body-file <comment>`: `--approve` on pass, `--request-changes` on stop, else `--comment`. Reviewer and author often share one GitHub identity, as in a crew, and GitHub allows only a comment on one's own PR; there the heading is the verdict, so a pass reads as a `COMMENT` review headed `pass`.

## A repository going public

[init](../open-source/references/init.md)'s order runs here, before the visibility change, its Leads and Triage by one `open-source-review` per batch, under [`parallelize`](../parallelize/SKILL.md#what-the-work-answers):

- **Units** — a batch file in scratch, one per agent, of sections headed `=== <id> <path or kind>`: blobs, or commit messages and identities, or tag messages and ref names, under the id `refs`. About 2,000 lines, so one agent reads it whole; a longer blob is a batch alone. The binaries and the licensing findings are a batch of their own.
- **Edges** — none between units; the leads are the contract each reads, pinned before the fan-out.
- **Action** — init's steps 3 and 6 over the batch.
- **Done** — every id its batch holds is on its `read:` list.
- **Checks** — none per unit; init's coverage proof is the check.

The session merges the groups, by lead and then by place, and init's Propose takes them to the person. The visibility change waits on their decision.
