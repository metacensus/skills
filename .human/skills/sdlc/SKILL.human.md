The part of the lifecycle every organization on the Initiative/Epic/Task/Bug ladder shares. Each stage belongs to a skill; what an organization decides is in its mapping.

## The ladder

An Initiative takes a quarter, holds Epics, and is the only parent an Epic takes. An Epic takes weeks and holds Tasks; a Task is one PR; a Spike is a Task that delivers a decision; a Bug is held to a Task's bar. A Task files where its PR lands.

## Mechanisms

Type, parent, dependency, and labels in four roles: `ready`, `designed`, `deviated`, `reached-up`; `designed` marks an issue a person can read alone and know what will be built. A card goes only on a board the mapping names whose description the issue serves.

## Status

Derived from GitHub, never written: Backlog, Blocked, Ready, In progress, In review, Done, Dropped. Work starts on a Ready Task or Bug.

## Roles

The `owner`, by default the assignee, sets scope and takes proposals; the `lead`, by default the user, takes stops and files Initiatives and Epics; `CODEOWNERS` names the `reviewer`. An agent may change a Task's type, labels but `ready` and `designed`, and links; otherwise it proposes, and asking it to pick an issue up lets it assign itself.

## Stages

A stage posts one comment headed `### <skill> · <Stage>: pass|pause|stop`, unless what it leaves on GitHub says as much. Pass proceeds, pause waits for the user, stop goes to the lead. Delegated work carries its pauses into the PR body.

## Closing

Done differently is completed plus `deviated`; `reached-up` marks a Task that rewrote its parent. A Spike closes once its decision is written where the work reads it.

## Linking an issue to its branch and PR

The PR closes the issue by number; `checkin` names the branch, linked at publishing, before the push, unless it is already pushed.

## The mapping

`sdlc-mapping.md` names labels, boards, columns, roles, checks, and cadence; a project's own is read first. Each row omitted, or holding a Hole, keeps its default.

## Setup

A script turns issues on, creates the labels, and checks the boards; the forms live once in the organization's `.github` repository.
