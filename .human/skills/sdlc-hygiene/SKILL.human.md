> A sweep finds drift from the `sdlc` lifecycle in issues, labels and boards, fixes what it may, escalates the rest.

Fires: grooming, sweeping, after a pivot, scheduling it; what is stale or undecided.

|Stage|Runs|⛔|🛑|
|---|---|---|---|
|Precheck|scope, classes, mapping, auth|no `project` scope|nothing in scope|
|Sweep|`sdlc-sweep` per repo|`short` line|repo unreadable|
|Read|`sdlc-family` per Epic, with `family`|·|Epic unreadable|
|Adopt|parent proposals|the outline|·|
|Act|setup, board, Task/Bug type, cards under a boarded Initiative|other flags|rate limit|
|Report|comment per Epic; a handoff per answered family|open flags|·|

## Adopt

Each orphan or root issue is proposed: 📌 existing parent · 🔗 issue that moves here · ⭐ parent to file · 🌙 none. Nothing attaches unanswered.

## Act

[`sdlc-setup.sh`](../sdlc/SKILL.human.md#setup) and `sdlc-status --apply` fix `setup`, `board`; an untyped Task or Bug takes its type; an `uncarded` issue under a boarded Initiative takes its card; every other flag ⛔, with what the sweep names, a `no <field>`, a value for its nearest Epic's card, else its own. Writes a second apart; a refused one, rate limits aside, is reported, the rest go on.

A request naming a class's fix is the yes to it.

## Schedule

A weekly cron runs a script on the delegator's machine: it reads the mapping and board status, runs Precheck, Sweep and Read through `claude -p` in a sandbox that reaches only GitHub, on tools that only read, and posts their summary, or what failed, on a private issue. A check needing more is `not run`. Adopt, Act and Report wait for the delegator. Run it once by hand, and read its comment, before the cron line goes in.
