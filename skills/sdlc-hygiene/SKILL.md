---
name: sdlc-hygiene
description: Sweep an organization's issues, labels and boards for drift from the `sdlc` lifecycle: fix what it may and escalate the rest, each family's open questions among them. Trigger when grooming, sweeping or cleaning up a backlog or board, when asking what has gone stale or drifted, and when asking what is left to decide.
---

The hygiene stages, each run as [the hub's protocol](../sdlc/SKILL.md#stages) says, their comments to the session.

## Precheck

- The scope is the user's Epic, else the repositories the user names, else the organization's unarchived repositories with issues on, `gh repo list OWNER -L 1000 --no-archived --json name,hasIssuesEnabled`. An Epic's scope is its family, the Epic and its sub-issues, `gh api repos/OWNER/REPO/issues/N/sub_issues --paginate`, and the repositories they live in. The boards are the mapping's Boards rows, and the thresholds its Cadence rows. With no mapping, ask the user where the organization's is, and take boards and forms from the answer.
- Each repository's forms, wherever [Setup](../sdlc/SKILL.md#setup) finds them, else the hub's [`forms/`](../sdlc/forms/), yield each type's required fields.
- `gh auth status` holds the `project` scope where a board is named.

**Escalate** without it: only the person at the keyboard can refresh it. **Stop** when no repository is in scope or the Epic cannot be read.

## Sweep

- One [`sdlc-sweep`](../../agents/sdlc-sweep.md) agent per repository, briefed as its [What you get](../../agents/sdlc-sweep.md#what-you-get) lists, with an Epic's family the numbers in that repository, through [`parallelize`](../parallelize/SKILL.md), answered: no edges, no checks, done when every open issue in scope, and every card the sweep reads, is read.

**Escalate** on a `short` line. **Stop** when a repository cannot be read.

## Read

- One [`sdlc-family`](../../agents/sdlc-family.md) agent per open Epic and Initiative in scope, `gh issue list -R OWNER/REPO --search type:Epic,Initiative` unless the Epic is the scope, through `parallelize`, answered as Sweep.

**Stop** when an Epic cannot be read.

## Adopt

- Each `orphan` and `root` issue, and each child the Read stage finds outside its parent's goal, gets one of three: an existing parent, a parent to file, or none, with its reason.
- A parent is checked against its Initiative's non-goals, and against the board the issue's subtree would join.
- The proposals go to the delegator as one [outline](../human-output/references/chat.md#the-outline), keyed 📌 existing parent · 🔗 existing issue that moves here · 🆕 to file · ⏸️ left without a parent.

**Escalate** the outline; nothing attaches before the delegator answers. Then `gh issue edit N --parent P` attaches each, an untyped issue takes its type, a parent to file goes through [`sdlc-intake`](../sdlc-intake/SKILL.md), and [`sdlc-status --reset --apply`](../sdlc/SKILL.md#status) runs on each parent that gained a child.

## Act

- Run [`sdlc-setup.sh`](../sdlc/SKILL.md#setup) on each repository, each `TODO` it prints a `setup` flag, and [`sdlc-status --apply`](../sdlc/SKILL.md#status) on each board, which settles every `board` flag.
- Every other flag escalates to the sweep's delegator, in the summary: a `ready` on an issue failing its form, or a label no role names, its removal; a missing `ready`, [`sdlc-intake`'s curation](../sdlc-intake/SKILL.md#curate); `setup`'s, and each `root` issue, as a question. It closes nothing.

**Stop** when GitHub refuses a write.

## Report

- Each Epic with questions, its children's among them, carries one comment headed `### sdlc-hygiene · Read: escalate`, a line `- [ ] <issue>: <question> → <direction>` per question.
- The stage's comment counts by class what was fixed and escalated.

**Escalate** while a flag or question waits on the delegator.
