---
name: sdlc-hygiene
description: Sweep an organization's issues, labels and boards for drift from the `sdlc` lifecycle: fix what it may, propose the rest, and put each family's open questions to the project manager. Trigger when grooming, sweeping or cleaning up a backlog or board, when asking what has gone stale or drifted, and when asking what the project manager should decide.
---

The hygiene stages, each run as [the hub's protocol](../sdlc/SKILL.md#stages) says, the mapping's Checks rows included. No one issue carries a sweep, so each stage's comment goes to the session.

## Precheck

- The repositories in scope are those the user names, else the [mapping's](../sdlc/SKILL.md#the-mapping) Repositories rows, each with its board, if any; the mapping's Cadence rows give the thresholds, the hub's defaults where absent.
- Each repository's forms, wherever [Setup](../sdlc/SKILL.md#setup) finds them, yield each type's required fields.
- `gh auth status` holds `read:project` where a board is named.

**Pause** without `read:project`, for the user to refresh. **Stop** when no repository is in scope.

## Sweep

- One [`sdlc-sweep`](../../agents/sdlc-sweep.md) agent per repository, briefed as its [What you get](../../agents/sdlc-sweep.md#what-you-get) lists, through [`parallelize`](../parallelize/SKILL.md), answered: units are the repositories, edges none, the action is to flag, done is every open issue and every card read, review none.

**Stop** when a repository cannot be read.

## Read

- One [`sdlc-family`](../../agents/sdlc-family.md) agent per open Epic in scope, through `parallelize`, answered as Sweep, with Epics for units and each agent's report for done.
- The project manager is the Epic's [`owner`](../sdlc/SKILL.md#roles).

**Stop** when an Epic cannot be read.

## Act

Act removes `ready` from an issue a `mislabeled` flag finds failing its form, where [the hub's table](../sdlc/SKILL.md#roles) says may, and moves the card a `board` flag names, as [Board](../sdlc/SKILL.md#mechanisms) allows. Every other flag is a proposal to its issue's `owner`: a label no role names, its removal; a missing `ready`, [`sdlc-intake`'s curation](../sdlc-intake/SKILL.md#curate); and `setup`'s go to the `lead`, in the summary. It closes nothing.

**Stop** when GitHub refuses a write.

## Report

- Each Epic with questions carries one comment, in the hub's shape, each question an unchecked line ending in its proposed direction.
- The session gets one summary: by class, what was fixed, proposed and asked.

**Pause** while a proposal or question waits on its `owner`.
