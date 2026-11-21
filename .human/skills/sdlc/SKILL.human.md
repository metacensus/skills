> Every organization on the Initiative / Epic / Task / Bug ladder shares one lifecycle; its `sdlc-mapping.md` binds it ([mapping](references/mapping.human.md)).

Fires: setting up issues, writing a mapping, asking how status works, reporting up. Setup runs first.

Backlog → Ready → In progress → In review → Done (↘ Blocked, Dropped)

## The ladder

|Jira|GitHub|Size|
|---|---|---|
|Initiative|`type: Initiative`|quarter|
|Epic|`type: Epic`|weeks|
|Story / Task|`type: Task`|days, one PR|
|Spike|Task titled `Spike: …`|a decision|
|Bug|`type: Bug`|as a Task|
|Sub-task|·|a Task wanting children is an Epic|

## Mechanisms

|Mechanism|Carries|
|---|---|
|Parent|Epic → Initiative; Task → Epic|
|Label|`ready`, `designed`, `deviated`, `reached-up`|
|Board|status and Priority, projected|
|Priority|set on Initiatives; blank inherits|

## Status

`sdlc-status.mts OWNER/N --mapping PATH [--apply] [--reset]` derives it.

|Status|Holds when|
|---|---|
|Backlog|open|
|Blocked|an open `blocked by`|
|Ready|`ready`, unassigned, unblocked, fields filled|
|In progress|assigned|
|In review|an open PR closes it|
|Done|closed **completed**|
|Dropped|closed **not planned**|

Work starts on a Ready Task or Bug, highest Priority first.

## Roles

|Role|Takes|
|---|---|
|`delegator`|what the delegate cannot own; default, whoever handed over the work|
|`reviewer`|a PR's review; default `CODEOWNERS`|

A delegate ⛔ escalates a choice it cannot own; a **remit** hands choices down. An agent acts on a Task or Bug, ⛔ on an Epic or Initiative; assigning and editing another's issue ⛔.

## Reporting

A person's attention is spent once per item: name it once, led by ⛔ waits on them · 🟢 ready for them · ✅ done.

## Stages

A stage runs its checks and posts one comment:

```markdown
### <skill> · <Stage>: pass|escalate|stop
```

|Ends in|Then|
|---|---|
|pass|proceed|
|escalate|the `delegator` takes it|
|stop|the same climb|

## Closing

|Outcome|Close|
|---|---|
|Done as planned|**completed**|
|Done differently|**completed** + `deviated`, ⛔|
|Parent rewritten|`reached-up`|
|Not planned|**not planned**, ⛔|

## Linking an issue to its branch and PR

`Closes #N` in the PR body; `gh issue develop N --name <branch>` before the push.

## Setup

Once per repository: `sdlc-setup.sh OWNER/REPO`; act on each `TODO`.

Add a missing column in the board's settings; replacing Status options through the API clears every card's Status, which `--apply` restores.
