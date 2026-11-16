> A sweep finds drift from the `sdlc` lifecycle in issues, labels and boards, fixes what it may, escalates the rest.

Fires: grooming, sweeping; what is stale or undecided.

|Stage|Runs|⛔|🛑|
|---|---|---|---|
|Precheck|scope, classes, mapping, auth|no `project` scope|nothing in scope|
|Sweep|`sdlc-sweep` per repo|`short` line|repo unreadable|
|Read|`sdlc-family` per Epic, with `family`|·|Epic unreadable|
|Adopt|parent proposals|the outline|·|
|Act|setup, board, Task/Bug type fixes|other flags|rate limit|
|Report|comment per Epic|open flags|·|

## Adopt

Each orphan or root issue is proposed: 📌 existing parent · 🔗 issue that moves here · 🆕 parent to file · ⏸️ none. Nothing attaches unanswered.

## Act

[`sdlc-setup.sh`](../sdlc/SKILL.human.md#setup) and `sdlc-status --apply` fix `setup`, `board`; an untyped Task or Bug takes its type; every other flag ⛔, with what the sweep names. Writes a second apart; a refused one, rate limits aside, is reported, the rest go on.

A request naming a class's fix is the yes to it.
