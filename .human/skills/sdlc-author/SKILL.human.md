> The author carries an issue from pickup to closed, one stage at a time.

Fires: picking up or landing an issue; answering its review.

Precheck → Design → Implement → Self-review → Publish → Respond ⟲ → Land

Stages run [the hub protocol](../sdlc/SKILL.human.md#stages); each fixes what it can first.

|Stage|Pass →|⛔|⏸️|
|---|---|---|---|
|Precheck|Design (Implement if `designed`)|fix not the author's|assigned elsewhere|
|Design|`designed` applied|until `designed`|fails its bar|
|Implement|Self-review; large: `parallelize`|design shifts|criterion unmeetable|
|Self-review|Publish|dispute at loop cap|Verification cannot pass|
|Publish|review|before linking; moving another's work|·|
|Respond|Land|dispute at loop cap|finding reopens design|
|Land|closed|a merge no remit reaches; a `deviated` or not-planned close|PR cannot merge|

Precheck reads a Release or Rollout blocker by title and state alone.

Publish blocks the earliest open Release after its blockers' Releases, filing the next if none; moving later takes the work it blocks along.

## Land

Merge and release per [`land`](../land/SKILL.human.md), [close](../sdlc/SKILL.human.md#closing), file follow-ups.

## Without a pull request

|Case|Path|
|---|---|
|Spike|Design → Land, ending at `Decision:`|
|Action Task|a role runs the command, then Land|
