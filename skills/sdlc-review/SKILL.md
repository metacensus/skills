---
name: sdlc-review
description: Carry a pull request's review from request to verdict. Trigger when reviewing a pull request, when asked for a review or assigned as reviewer, and when asking whether a PR is ready to merge.
---

The reviewer's stages, each run as [the hub's protocol](../sdlc/SKILL.md#stages) says, their comments on the pull request.

## Precheck

`gh pr view N --json author,isDraft,reviewRequests,closingIssuesReferences` and `gh pr checks N`.

- The acting identity, `gh api user --jq .login`, holds a delegation the user or an orchestrator wrote, which the comment cites, or is a requested reviewer or [the `reviewer` role](../sdlc/SKILL.md#roles) and not the PR's author.
- The PR is not a draft.
- It closes an issue whose [derived status](../sdlc/SKILL.md#status) is In review.
- CI has passed.
- It is current with its base, or no section it links to changed there since.

**Escalate** while CI runs, on a review request or closing link the user or author can add, and on a linked section its base has since changed. **Stop** on a draft, an undelegated review of one's own PR, a closed issue, or failing CI.

## Summarize

For a reader who did not write the PR, from its diff and body alone: each significant choice, structure and architecture first, as

```markdown
- [x] <existing element>, which <role>, changed: <change> for <purpose>
```

with one change or a list; an added file's existing element is the nearest one it joins. The author corrects it in reply, reopening Focus, which does not wait.

**Escalate** on a choice the diff and body do not explain, a finding against the body's [4C](../elegance/references/cells/4C-merges.md). **Stop** on a PR too large to summarize, which 4C splits.

## Focus

The comment answers each question:

1. What breaks, and for whom, if this is wrong?
2. What is irreversible: pushed history, a published name, a migration, data written?
3. What is the one thing the author is most likely wrong about?
4. Where does the diff touch a location that does not gate, per `node ${CLAUDE_PLUGIN_ROOT}/scripts/check-cells.mts --diff`, or from the paths without a mapping? Moot for prose alone, which never gates.
5. Would the Verification block fail if a criterion did?
6. Does the PR do what the issue asked, and nothing else?

Then the checks, hardest where the answers point:

- [`elegance`](../elegance/SKILL.md), and its [`elegance-review`](../../agents/elegance-review.md) agent over the diff.
- The [mapping's](../sdlc/SKILL.md#the-mapping) Checks rows scoped to review.
- In a public repository, [`open-source`'s review](../open-source/references/review.md).
- The host's reviewer, `/code-review` where one exists.
- The issue's Verification block exits 0 on the PR's head.

The comment is the verdict, posted once every check finishes: `gh pr review N --body-file <comment>` with `--approve` on pass, `--comment` on escalate, `--request-changes` on stop, or `--comment` for all on one's own PR, where GitHub allows nothing else. A check that cannot finish is unchecked with its reason and caps the verdict at escalate. **Escalate** on findings the author can apply as written. **Stop** on a finding that reopens the design or a criterion.
