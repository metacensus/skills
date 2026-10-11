The part of the lifecycle every organization on the Epic/Task/Bug ladder shares. Each stage is its own skill; what an organization decides is in its mapping.

## The ladder

An Epic takes weeks and holds Tasks; a Task is one PR, what agents pick up; a Spike is a Task whose deliverable is a decision; a Bug is Task-sized. Quarter-scale outcomes are Efforts on the roadmap, not issues. A Task that wants children is an Epic. Each issue's owner decides its scope. A Task files where its PR lands, unless the Epic's owner keeps it beside the Epic.

## Mechanisms

Type, parent, dependency, and labels in four roles: `ready`, `designed`, `deviated`, `reached-up`. A board only where the mapping names one, mirroring status.

## Status

Derived from GitHub, never written: Backlog, Blocked, Ready, In progress, In review, Done, Dropped. Work starts only on a Ready Task or Bug: labeled `ready`, unassigned, unblocked, and carrying its form's fields.

## Roles

The `owner`, by default the assignee, takes proposals; the `lead`, by default the user, takes stops. An agent may change a Task's type, labels and links; on an Epic, and to assign, close, or edit another's body, it proposes.

## Stages

A stage runs its checks and posts one comment headed `### <skill> · <Stage>: pass|pause|stop`: pass proceeds, pause waits for the user to confirm small tweaks, stop goes to the lead.

## Closing

Done differently is completed plus `deviated`; `reached-up` marks a Task that forced its parent's rewrite. A Spike closes once its decision is written where the work reads it.

## Linking an issue to its branch and PR

The PR closes the issue by number, across repositories when they differ; `checkin` names the branch.

## The mapping

`sdlc-mapping.md`, beside the organization's other mappings and overridden by a project's own, names labels, boards, board columns, roles, extra checks, and cadence. Where it is silent the defaults hold; a Hole is an open decision.

## Setup

A script turns issues on and creates the labels; the forms live once in the organization's `.github` repository.
