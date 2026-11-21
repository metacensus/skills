---
name: org-rollout
description: Apply one change across many repositories — survey which need it, one PR per repository, merge on green, verify each. Trigger when a pin, a label set, a workflow, a plugin install or a repository setting must land in several repositories, and when asked which repositories still lack one.
---

**One probe answers both the survey and the verification**, so "needs it" and "has it" cannot drift apart.

```
Probe → Survey → ⛔ List → Pilot → Fan-out → Verify → Report
```

## The probe

- One read-only command per repository that exits 0 when the change is present, run as the identity that will write it, reading the default branch through the API so nothing is cloned to look: `gh api repos/ORG/REPO/contents/.nvmrc -H 'Accept: application/vnd.github.raw' | grep -qx 22`, `gh api repos/ORG/REPO/labels/LABEL`, `gh api repos/ORG/REPO --jq .allow_auto_merge | grep -qx true`.
- A change with several spellings probes each: a Node pin lives in `.nvmrc`, `engines` and CI's `node-version`.

## Survey

- `gh repo list ORG --no-archived --source --limit 1000 --json name --jq '.[].name'`, then the probe over each: one row per repository, `needs`, `has`, or `skips` with its reason.
- ⛔ The person confirms the list and the change before any write: the list is the scope.

## The change

- Pinned before the fan-out in a file every agent reads: a patch, a script, or exact content, per [`parallelize`](../parallelize/SKILL.md#decide-before-fanning-out).
- A repository it does not fit escalates; no agent improvises a variant.

## Pilot

One repository end to end first: change, merge, probe. A defect found there is fixed once, not once per repository.

## Per repository

- **A file change** is one PR, its branch named per [`checkout`](../checkout/SKILL.md#2-name-the-branch) and its title the same in every repository, held to that repository's own gate and PR template.
- **Its body names the asking issue** as `OWNER/REPO#N` with no closing keyword: one issue tracks the rollout, none per repository.
- **A label or setting** has no PR: one API write, the probe before and after.
- **Merging** is the remit's to grant; without it each PR waits on its repository's reviewers. With it, [`land`](../land/SKILL.md) waits on CI and merges.
- A repository whose default branch is already red is reported, not fixed.

## Fan-out

The [`parallelize`](../parallelize/SKILL.md#what-the-work-answers) questions, answered:

- **Units**: the repositories past the pilot.
- **Edges**: none, except that a repository others consume (a shared workflow, a template, a published package) goes first.
- **Action**: [Per repository](#per-repository).
- **Done**: the probe passes on the default branch.
- **Checks**: each repository's gate, and [`checkin`](../checkin/SKILL.md).

REST over GraphQL, writes spaced a second apart: GraphQL's secondary limit trips first under parallel agents.

## Verify

- The probe again across the whole list after the merges; it is the asking issue's Verification, and the issue closes once it passes.
- One live check where only use proves the change: a plugin loads, a workflow runs.

## Report

One row per repository: probe before, PR, merged, probe after, laid out per [`sdlc`'s Reporting](../sdlc/SKILL.md#reporting).
