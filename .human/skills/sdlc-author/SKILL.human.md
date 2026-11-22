> The author carries an issue from pickup to closed, and any change from its first edit to merged, one stage at a time.

Fires: picking up or landing an issue; answering its review; a first edit, commit, push or PR; waiting on CI; merging, or a refused merge.

Precheck → Design → Implement → Self-review → Open → Respond ⟲ → Land

Stages run [the hub protocol](../sdlc/SKILL.human.md#stages); each fixes what it can first. A change with no issue runs Implement through Open.

|Stage|Pass →|⛔|⏸️|
|---|---|---|---|
|Precheck|Design (Implement if `designed`)|fix not the author's|assigned elsewhere|
|Design|`designed` applied|until `designed`|fails its bar|
|Implement: from current `origin/<default>`, named branch, own worktree, stay inside|Self-review; large: `parallelize`|design shifts|criterion unmeetable|
|Self-review: scripts only|Open|secret in pushed history|Verification cannot pass|
|Open|review|before the first commit or push; moving another's work|·|
|Respond|Land|dispute at loop cap|finding reopens design|
|Land|closed, then the delegator's Accept|a merge no remit reaches; a `deviated` or not-planned close|PR cannot merge|

Precheck reads a Publish, Release or Rollout blocker by title and state alone.

Self-review runs [sync](#sync), Verification, the gate, `check-cells.mts --diff`, and in a public repo `gitleaks`.

## Open

|Check|Holds|
|---|---|
|Branch|not the default; `<your-name>/<topic>`|
|Precedent|copy 2-3 siblings, key by key|
|Derived|no computed or falsifiable fact; each fact once|
|Falsified|grep the entity; re-read each reference|
|Surgical|needed lines only; ⚠️ never reformat a file|
|Diff|read `git --no-pager diff` as a reviewer|
|Text|commit [5C](../elegance/references/cells/5C-commit.human.md), PR [4C](../elegance/references/cells/4C-merges.human.md)|
|Unverified|a draft until `gh pr ready`|

Open blocks the earliest open Publish that holds, filing the next if none: a work blocker ships in it or earlier, a Publish blocker is strictly earlier, versions compared within one repo; moving later takes the work it blocks along.

## Sync

Fetch and bring in main: rebase while alone and unreviewed, merge once shared; ⚠️ never force-push over others. Regenerate a generated file's conflict.

## Land

Merge on the review's pass; a stack bottom first, each child retargeted, [synced](#sync) and rerun; it ships in its Publish through [`sdlc-ship`](../sdlc-ship/SKILL.human.md), never tagged here. [Close](../sdlc/SKILL.human.md#closing), capture follow-ups.

## Waiting

⚠️ Never `sleep`: wait on a background command that exits on every terminal state, or once stalled past twice the usual length.

## A refused merge

| Refused | Then |
|---|---|
| check pending or failing | wait, or fix |
| branch behind | [sync](#sync) |
| review required | the `reviewer`; never self-approve |
| auto-merge off | merge once green |
| method not allowed | an allowed one |
| rule violated | meet it, or an admin |
| GraphQL limit | REST |
| environment refuses | ⛔ a person, per [`human-steps`](../human-steps/SKILL.human.md) |
| merged by mistake | revert in a PR, whatever the merge method; ⚠️ never force-push |

## Without a pull request

|Case|Path|
|---|---|
|Spike|Design → Land, ending at `Decision:`|
|Action Task|a role runs the command, then Land|
