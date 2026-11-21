> A request becomes a `ready` issue, marked so by the delegator or a delegate whose remit names it.

Fires: filing, composing, curating; asked if ready.

Compose → File → Curate → ready

## Compose

|Check|Rule|
|---|---|
|Type|on the [ladder](../sdlc/SKILL.human.md#the-ladder); ⛔ Initiative, Epic|
|Form|required fields|
|Irreversible step|each precondition a criterion|
|Duplicate|Bug: search open issues, PRs; a match takes a comment|
|Problem|first; a solution only if decided or the constraint|
|Text|no emojis, inventions, hard wraps|

## Decompose

Epic children: blockers first, all before Curate.

## File

`gh issue create`, then [`sdlc-status --apply`](../sdlc/SKILL.human.md#status). No label. Refs by number or URL; `--project` needs the `project` scope.

## Curate

Rerun Compose: delegator applies `ready`; others ⛔.
