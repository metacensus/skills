The lifecycle every organization on the Initiative/Epic/Task/Bug ladder shares; what an organization decides is in its mapping.

## The ladder

An Initiative takes a quarter and holds Epics; an Epic takes weeks and holds Tasks; a Task is one PR, filed where it lands; a Spike is a Task that delivers a decision; a Bug is held to a Task's bar.

## Mechanisms

Type, parent, dependency, and four labels: `ready`, `designed`, `deviated`, `reached-up`. A card goes only on a board whose description the issue serves.

## Status

Derived from GitHub, never written: Backlog, Blocked, Ready, In progress, In review, Done, Dropped. Work starts on a Ready Task or Bug.

## Roles

The `owner`, by default the assignee, sets scope and takes proposals; the `delegator`, whoever handed the work over, takes escalations and writes the remit, the choices the delegate owns; the `lead`, by default the user, files Initiatives and Epics; `CODEOWNERS` names the `reviewer`. An agent may change a Task's type, labels but `ready` and `designed`, and links; otherwise it proposes.

## Stages

A stage posts one comment headed `### <skill> · <Stage>: pass|escalate|stop`, unless GitHub already says as much. Pass proceeds; escalate goes to the delegator and climbs; stop does the same with no way forward. A comment naming a private repository stays private.

## Closing

Done differently is completed plus `deviated`; `reached-up` marks a Task that rewrote its parent. A Spike closes once its decision is written where the work reads it.

## Linking an issue to its branch and PR

The PR closes the issue by number; `checkin` names the branch, linked at publishing, before the push, unless it is already pushed.

## The mapping

`sdlc-mapping.md` binds the lifecycle to an organization; its [schema](references/mapping.human.md) is kept apart.

## Setup

A script turns issues on, creates the labels, and checks the boards; the forms live once in the organization's `.github` repository.
