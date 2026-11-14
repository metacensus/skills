> A pull request's review runs from request to verdict, each stage a comment on the PR, run as [the hub's protocol](../sdlc/SKILL.human.md#stages) says.

Fires: reviewing a PR, a review requested or assigned, or asked whether a PR may merge.

```
Precheck → Summarize → Focus → Verdict
              ↑          │
              └─ author corrects the summary
```

Key: ✅ pass · ⛔ escalate (a choice or fix someone else owns) · 🛑 stop

## Precheck

`gh pr view N --json author,isDraft,reviewRequests,closingIssuesReferences` · `gh pr checks N`

| Must hold | ⛔ escalate | 🛑 stop |
|---|---|---|
| Acting identity (`gh api user --jq .login`) holds a [remit](../sdlc/SKILL.human.md#roles) the comment cites, or is a requested reviewer or [`reviewer`](../sdlc/SKILL.human.md#roles) and not the author | · | own PR, no remit hands it over |
| Not a draft | · | draft |
| Closes an issue whose [derived status](../sdlc/SKILL.human.md#status) is In review | review request or closing link the delegator or author can add | issue closed |
| CI passed | CI running | CI failing |
| Current with base, or no linked section changed there since | linked section changed | · |

## Summarize

Input: the diff and body alone, for a reader who did not write the PR. Output: each significant choice, structure and architecture first.

```markdown
- [x] <existing element>, which <role>, changed: <change> for <purpose>
```

- An added file's element is the nearest existing one it joins.
- The author corrects in reply, reopening Focus; Focus does not wait.
- ⛔ a choice the diff and body do not explain
- 🛑 PR too large to summarize; 4C splits it

## Focus

The comment answers each:

1. What breaks, and for whom, if this is wrong?
2. What is irreversible: pushed history, a published name, a migration, data written?
3. What is the one thing the author is most likely wrong about?
4. Where does the diff touch a location that does not gate (`node ${CLAUDE_PLUGIN_ROOT}/scripts/check-cells.mts --diff`, or paths with no mapping)? Moot for prose alone.
5. Would the Verification block fail if a criterion did?
6. Does the PR do what the issue asked, and nothing else?

Then the checks, hardest where the answers point:

- [`elegance`](../elegance/SKILL.human.md), plus its [`elegance-review`](../../agents/elegance-review.human.md) agent over the diff
- The [mapping's](../sdlc/SKILL.human.md#the-mapping) Checks rows scoped to review
- Public repository: [`open-source` review](../open-source/references/review.human.md)
- The host's reviewer, `/code-review` where one exists
- The issue's Verification block exits 0 on the PR's head

Verdict: the comment, posted once every check finishes, to the issue's carrier, whose Land takes it as input. A check that cannot finish is unchecked with its reason, and the verdict cannot pass.

| Verdict | When | `gh pr review N --body-file <comment>` |
|---|---|---|
| ✅ Pass | no finding needs a choice (findings the author can apply as written included) | `--approve` |
| ⛔ Escalate | a fix is a choice neither author nor this remit owns | `--comment` |
| 🛑 Stop | a finding reopens the design or a criterion | `--request-changes` |

Shared author and reviewer identity (a crew): GitHub allows only a comment on one's own PR, so the heading is the verdict. A pass is a `COMMENT` review headed `pass`.
