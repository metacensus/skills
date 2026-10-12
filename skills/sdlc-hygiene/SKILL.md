---
name: sdlc-hygiene
description: Sweep an organization's issues, labels and boards for drift from the `sdlc` lifecycle: fix what it may, propose the rest, and put each family's open questions to the project manager. Trigger when grooming, sweeping or cleaning up a backlog or board, when asking what has gone stale or drifted, and when asking what the project manager should decide.
---

The hygiene stages, each run as [the hub's protocol](../sdlc/SKILL.md#stages) says, their comments to the session.

## Precheck

- The repositories in scope are those the user names, else the [mapping's](../sdlc/SKILL.md#the-mapping) Repositories rows; the thresholds are its Cadence rows. With no mapping, ask the user where the organization's is, and take boards and forms from the answer.
- Each repository's forms, wherever [Setup](../sdlc/SKILL.md#setup) finds them, else the hub's [`forms/`](../sdlc/forms/), yield each type's required fields.
- `gh auth status` holds the `project` scope where a board is named.

**Pause** without it, for the user to refresh. **Stop** when no repository is in scope.

## Sweep

- One [`sdlc-sweep`](../../agents/sdlc-sweep.md) agent per repository, briefed as its [What you get](../../agents/sdlc-sweep.md#what-you-get) lists, through [`parallelize`](../parallelize/SKILL.md), answered: no edges, no review, done when every open issue and its cards are read.

**Pause** on a `short` line. **Stop** when a repository cannot be read.

## Read

- One [`sdlc-family`](../../agents/sdlc-family.md) agent per open Epic in scope, `gh issue list -R OWNER/REPO --search type:Epic`, through `parallelize`, answered as Sweep, its questions for the Epic's [`owner`](../sdlc/SKILL.md#roles).

**Stop** when an Epic cannot be read.

## Act

- Run [`sdlc-setup.sh`](../sdlc/SKILL.md#setup) on each repository, each `TODO` it prints a `setup` flag, and move each card a `board` flag names, as [Board](../sdlc/SKILL.md#mechanisms) allows, adding none and moving no Initiative's or Epic's, nor one whose issue awaits its `owner` on a `mislabeled` proposal.
- Every other flag is a proposal to its issue's `owner`, a `misparented` one to its parent's: a `ready` on an issue failing its form, or a label no role names, its removal; a missing `ready`, [`sdlc-intake`'s curation](../sdlc-intake/SKILL.md#curate); `setup`'s, and each `root` issue as a question, go to the `lead`, in the summary. It closes nothing.

**Stop** when GitHub refuses a write.

## Report

- Each Epic with questions, its children's among them, carries one comment headed `### sdlc-hygiene · Read: pause`, a line `- [ ] <issue>: <question> → <direction>` per question.
- The stage's comment counts by class what was fixed, proposed and asked; where it names a private repository, it lands in a private one, never a public issue.

**Pause** while a proposal or question waits on its `owner`.
