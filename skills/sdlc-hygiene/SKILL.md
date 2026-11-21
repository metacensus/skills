---
name: sdlc-hygiene
description: Sweep an organization's issues, labels and boards for drift from the `sdlc` lifecycle: fix what it may and escalate the rest, each family's open questions among them. Trigger when grooming, sweeping or cleaning up a backlog or board, when asking what has gone stale or drifted, after a pivot, when asking what is left to decide, and when scheduling the sweep.
---

The hygiene stages, each run as [the hub's protocol](../sdlc/SKILL.md#stages) says, their comments to the session.

## Precheck

- The scope is the user's Epic, else the repositories the user names, else the organization's unarchived repositories with issues on, `gh repo list OWNER -L 1000 --no-archived --json name,hasIssuesEnabled`. An Epic's scope is its family, the Epic and its sub-issues, `gh api repos/OWNER/REPO/issues/N/sub_issues --paginate`, and the repositories they live in. The boards are the mapping's Boards rows, and the thresholds its Cadence rows. With no mapping, ask the user where the organization's is, and take boards and forms from the answer.
- The classes are the [sweep's](../../agents/sdlc-sweep.md#what-you-do) and Read's `family`: those the request names, else all.
- Each repository's forms, wherever [Setup](../sdlc/SKILL.md#setup) finds them, else the hub's [`forms/`](../sdlc/forms/), yield each type's required fields.
- `gh auth status` holds the `project` scope where a board is named.

**Escalate** without it: only the person at the keyboard can refresh it. **Stop** when no repository is in scope or the Epic cannot be read.

## Sweep

- One [`sdlc-sweep`](../../agents/sdlc-sweep.md) agent per repository, briefed as its [What you get](../../agents/sdlc-sweep.md#what-you-get) lists, with an Epic's family the numbers in that repository, through [`parallelize`](../parallelize/SKILL.md), answered: no edges, no checks, done when every issue in scope the classes need, and every card the sweep reads, is read.

**Escalate** on a `short` line. **Stop** when a repository cannot be read.

## Read

- With `family` among the classes, one [`sdlc-family`](../../agents/sdlc-family.md) agent per open Epic and Initiative in scope, `gh issue list -R OWNER/REPO --search type:Epic,Initiative` unless the Epic is the scope, through `parallelize`, answered as Sweep.

**Stop** when an Epic cannot be read.

## Adopt

- With `orphan` or `family` among the classes, each `orphan` and `root` issue, and each child the Read stage finds outside its parent's goal, gets one of three: an existing parent, a parent to file, or none, with its reason.
- A parent is checked against its Initiative's non-goals, and against the board the issue's subtree would join.
- The proposals go to the delegator as one [outline](../human-output/references/chat.md#the-outline), keyed 📌 existing parent · 🔗 existing issue that moves here · ⭐ to file · 🌙 left without a parent.

**Escalate** the outline; nothing attaches before the delegator answers. Then `gh issue edit N --parent P` attaches each, an untyped issue takes its type, a parent to file goes through [`sdlc-intake`](../sdlc-intake/SKILL.md), and [`sdlc-status --reset --apply`](../sdlc/SKILL.md#status) runs on each parent that gained a child.

## Act

- Run [`sdlc-setup.sh`](../sdlc/SKILL.md#setup) on each repository, each `TODO` it prints a `setup` flag, and [`sdlc-status --apply`](../sdlc/SKILL.md#status) on each board, which settles every `board` flag.
- An `untyped` Task or Bug takes the type the sweep names.
- Every other flag escalates to the sweep's delegator, in the summary: a `ready` on an issue failing its form, its removal; a missing `ready`, [`sdlc-intake`'s curation](../sdlc-intake/SKILL.md#curate); `unowned`, the assignee the sweep names; an `untyped` Epic or Initiative, its type; a `no <field>` note, the value the sweep names for its topmost card, then `sdlc-status --apply`; `uncarded`, a card on the board the sweep names, then `sdlc-status --apply`; `setup`'s, and each `root` issue, as a question. A request that named a class's fix is the delegator's yes to it. It closes nothing.
- Its own writes go out a second apart: GitHub's secondary limit, which `gh api rate_limit` does not show, refuses a faster burst. A write GitHub refuses, but for a rate limit, is reported with its flag, and the rest go on.

**Stop** on a rate limit; a rerun once it resets skips what is written.

## Report

- Each Epic with questions, its children's among them, carries one comment headed `### sdlc-hygiene · Read: escalate`, a line `- [ ] <issue>: <question> → <direction>` per question.
- Once the delegator answers, each answer is commented on its Epic, and a family left with no question goes to its crew by a [handoff](../sdlc/SKILL.md#handoff), those answers its Decided.
- The stage's comment counts by class what was fixed and escalated.

**Escalate** while a flag or question waits on the delegator.

## Schedule

- The mapping's `sweep` cadence runs Precheck, Sweep and Read unattended, as a cron on the delegator's machine, where `gh` holds the `project` scope.
- Its line fetches the mapping and names an issue in a private repository, where the run posts its stage comments, flags and Read's questions. Its tools read, and write only that comment.
- Adopt, Act and Report wait for the delegator, in a session opened on that comment.

```text
0 9 * * 1  gh api -H 'Accept: application/vnd.github.raw' repos/OWNER/REPO/contents/PATH > /tmp/sdlc-mapping.md && claude -p "Run sdlc-hygiene's Precheck, Sweep and Read on OWNER. The mapping is /tmp/sdlc-mapping.md. Comment the summary on OWNER/PRIVATE#N." --allowedTools Agent Read 'Bash(gh auth status)' 'Bash(gh repo list *)' 'Bash(gh issue list *)' 'Bash(gh issue view *)' 'Bash(gh search issues *)' 'Bash(gh pr view *)' 'Bash(gh api repos/*/sub_issues --paginate)' 'Bash(node *sdlc-status.mts *)' 'Bash(gh issue comment *)' --disallowedTools 'Bash(*--apply*)'
```

Weekly is the default 7 days; every N days is `0 9 */N * *`.
