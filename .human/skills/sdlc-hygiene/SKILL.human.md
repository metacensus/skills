> A sweep finds drift from the `sdlc` lifecycle in issues, labels and boards, fixes what it may, escalates the rest.

Fires: grooming, sweeping; what is stale or undecided.

|Stage|Runs|⛔|🛑|
|---|---|---|---|
|Precheck|scope, mapping, auth|no `project` scope|nothing in scope|
|Sweep|`sdlc-sweep` per repo|`short` line|repo unreadable|
|Read|`sdlc-family` per Epic|·|Epic unreadable|
|Adopt|parent proposals|the outline|·|
|Act|setup, board fixes|other flags|write refused|
|Report|comment per Epic|open flags|·|

## Adopt

Each orphan or root issue is proposed: 📌 existing parent · 🔗 issue that moves here · 🆕 parent to file · ⏸️ none. Nothing attaches unanswered.

## Act

[`sdlc-setup.sh`](../sdlc/SKILL.human.md#setup) and `sdlc-status --apply` fix `setup`, `board`; every other flag ⛔.
