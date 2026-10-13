---
name: sdlc-hygiene
description: Sweep an organization's issues, labels and boards for drift from the `sdlc` lifecycle: fix what it may, propose the rest, and put each family's open questions to the project manager. Trigger when grooming, sweeping or cleaning up a backlog or board, when asking what has gone stale or drifted, and when asking what the project manager should decide.
---

The hygiene stages, each run as [the hub's protocol](../sdlc/SKILL.md#stages) says, their comments to the session.

## Precheck

- The scope is the user's Epic, else the repositories the user names, else the [mapping's](../sdlc/SKILL.md#the-mapping) Repositories rows. An Epic's scope is its family, the Epic and its sub-issues, `gh api repos/OWNER/REPO/issues/N/sub_issues --paginate`, and the repositories they live in. The thresholds are the mapping's Cadence rows. With no mapping, ask the user where the organization's is, and take boards and forms from the answer.
- Each repository's forms, wherever [Setup](../sdlc/SKILL.md#setup) finds them, else the hub's [`forms/`](../sdlc/forms/), yield each type's required fields.
- `gh auth status` holds the `project` scope where a board is named.

**Escalate** without it: only the person at the keyboard can refresh it. **Stop** when no repository is in scope or the Epic cannot be read.

## Sweep

- One [`sdlc-sweep`](../../agents/sdlc-sweep.md) agent per repository, briefed as its [What you get](../../agents/sdlc-sweep.md#what-you-get) lists, with an Epic's family the numbers in that repository, through [`parallelize`](../parallelize/SKILL.md), answered: no edges, no review, done when every open issue in scope and its cards are read.

**Escalate** on a `short` line. **Stop** when a repository cannot be read.

## Read

- One [`sdlc-family`](../../agents/sdlc-family.md) agent per open Epic in scope, the one Epic when it is the scope, `gh issue list -R OWNER/REPO --search type:Epic`, through `parallelize`, answered as Sweep, its questions for the Epic's [`owner`](../sdlc/SKILL.md#roles).

**Stop** when an Epic cannot be read.

## Act

- Run [`sdlc-setup.sh`](../sdlc/SKILL.md#setup) on each repository, each `TODO` it prints a `setup` flag, and move each card a `board` flag names, as [Board](../sdlc/SKILL.md#mechanisms) allows, adding none and moving no Initiative's or Epic's, nor one whose issue awaits its `owner` on a `mislabeled` proposal.
- Every other flag is a proposal to its issue's `owner`, a `misparented` one to its parent's: a `ready` on an issue failing its form, or a label no role names, its removal; a missing `ready`, [`sdlc-intake`'s curation](../sdlc-intake/SKILL.md#curate); `setup`'s, and each `root` issue as a question, go to the `lead`, in the summary. It closes nothing.

**Stop** when GitHub refuses a write.

## Report

- Each Epic with questions, its children's among them, carries one comment headed `### sdlc-hygiene · Read: escalate`, a line `- [ ] <issue>: <question> → <direction>` per question.
- The stage's comment counts by class what was fixed, proposed and asked.

**Escalate** while a proposal or question waits on its `owner`.
