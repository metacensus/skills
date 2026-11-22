> A sweep finds drift from the `sdlc` lifecycle in issues, labels and boards, fixes what it may, escalates the rest.

Fires: grooming, sweeping, after a pivot, scheduling it; what is stale or undecided.

|Stage|Runs|⛔|🛑|
|---|---|---|---|
|Precheck|scope: Epic, Initiative, board, topic, repos, org; classes from the request's words; mapping, auth|no `project` scope; a topic's list|nothing in scope|
|Sweep|`sdlc-sweep` per repo|`short` line|repo unreadable|
|Read|`design-check` per Epic, with `family`|·|Epic unreadable|
|Adopt|parent proposals|the outline|·|
|Act|in scope: board; setup on repos, org; sweep-named type, assignee, failing `ready`, `no <field>`, boarded card|one yes/no list|rate limit|
|Report|comment per Epic; a handoff per answered family|open flags|·|

## Adopt

Each orphan or root issue is proposed: 📌 existing parent · 🔗 issue that moves here · ⭐ parent to file · 🌙 none. They go up in Act's list; nothing attaches unanswered.

## Act

A sweep request is the yes to Act's fixes, written only to issues in scope, on a board scope to no other board's cards: an `uncarded` issue boarded outside it goes to the list. [`sdlc-setup.sh`](../sdlc/SKILL.human.md#setup) runs on a repos or org scope; `sdlc-status --apply` settles `board`. Five flags take the value the sweep names: a type, an assignee, a failing `ready` off, a `no <field>` on its nearest Epic's card in scope, a card under a boarded Initiative. Every other flag, Adopt's proposals and Read's questions go up as one yes/no list, answered in one reply: a missing `ready`; a `release-order` (a work blocker shipping later, a Release blocker not earlier, one repo), a move to a later Release, a renumbering only the delegator's call. A request naming a class's fix, or quoting a standing grant, says yes to its lines, but never to a choice of goal, scope or parent, or anything irreversible. Act closes nothing: a yes to a close goes on the issue for its carrier. Writes a second apart; a refused one, rate limits aside, is reported, the rest go on.

## Schedule

A weekly cron runs a script on the delegator's machine: it reads the mapping and board status, runs Precheck, Sweep and Read through `claude -p` in a sandbox that reaches only GitHub, on tools that only read, and posts their summary, or what failed, on a private issue. A check needing more is `not run`. Adopt, Act and Report wait for the delegator. Run it once by hand, and read its comment, before the cron line goes in.
