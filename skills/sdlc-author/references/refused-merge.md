# A refused merge

Read when a merge is refused, or lands by mistake, at [Land](../SKILL.md#land).

| The refusal says | Cause | Then |
|---|---|---|
| a required check is pending or failing | CI is not green | wait, or fix |
| the head branch is behind | protection requires an up-to-date branch | [Sync](../SKILL.md#sync), then wait |
| a review is required | protection requires an approval | the [`reviewer`](../../sdlc/SKILL.md#roles); never self-approve |
| auto-merge is not allowed | the repository turned it off | merge once green, per [Where CI stops](../../dev-ci-github/SKILL.md#where-ci-stops) |
| the merge method is not allowed | the repository allows others | `gh api repos/O/R --jq '[.allow_squash_merge,.allow_merge_commit,.allow_rebase_merge]'`, then an allowed one |
| a repository rule is violated | a ruleset | `gh api repos/O/R/rules/branches/<default>` names it: meet it, or hand it to an admin |
| `gh pr merge` hits a GraphQL limit while `gh api rate_limit` shows room | GraphQL's own limit | REST: `gh api -X PUT repos/O/R/pulls/N/merge -f merge_method=squash` |
| the agent's environment refuses the command | policy: the merge is a person's | hand them the one command per [`human-steps`' Commands](../../human-steps/SKILL.md#commands); never route around it through REST, `--admin`, or another identity |
| none: a merge landed on `<default>` by mistake | — | revert it in a PR of its own: `git revert -m 1 <merge commit>`, `git revert <squash commit>`, or `git revert <first>^..<last>` for a rebase merge; never force-push `<default>` |
