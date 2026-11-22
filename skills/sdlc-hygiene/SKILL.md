---
name: sdlc-hygiene
description: Sweep an organization's issues, labels and boards for drift from the `sdlc` lifecycle: fix what it may and escalate the rest, each family's open questions among them. Trigger when grooming, sweeping or cleaning up a backlog or board, when asking what has gone stale or drifted, after a pivot, when asking what is left to decide, and when scheduling the sweep.
---

The hygiene stages, each run as [the hub's protocol](../sdlc/SKILL.md#stages) says, their comments to the session.

## Precheck

| Scope | The request names | Issues |
|---|---|---|
| Epic | an Epic | its family, the Epic and its sub-issues, `gh search issues -L 1000 -- 'parent-issue:OWNER/REPO#N'` |
| Initiative | an Initiative | its family two levels deep, the Initiative, its Epics and their children, by the same search run on the Initiative and then on each Epic it returns |
| board | one or more boards, `OWNER/N` | each card's issue and its Initiative, the first and fourth columns of `sdlc-status OWNER/N --mapping PATH`, and its parent, `gh issue list -R OWNER/REPO --state all -L 1000 --json number,parent` |
| topic | a topic | what its searches match, `gh search issues --owner OWNER -L 1000 --json repository,number,title,state -- 'QUERY'`, each exclusion a `-repo:` or `-label:` qualifier |
| repositories | repositories | every issue in them |
| organization | none of these | every issue in its unarchived repositories with issues on, `gh repo list OWNER -L 1000 --no-archived --json name,hasIssuesEnabled` |

The scope is the first row that holds. The first four list issues, each with its repository, and any scope drops what the request excludes.

- The boards are the mapping's Boards rows, and the thresholds its Cadence rows. With no mapping, ask the user where the organization's is, and take boards and forms from the answer.
- The classes are the [sweep's](../../agents/sdlc-sweep.md#what-you-do) and Read's `family`: those the request names, by name or by a word for what a class checks, less those it excludes, else all. "Relationships" selects `orphan`, `misparented` and `family`. The stage's comment names the classes taken.
- Each repository's forms, wherever [Setup](../sdlc/SKILL.md#setup) finds them, else the hub's [`forms/`](../sdlc/forms/), yield each type's required fields.
- `gh auth status` holds the `project` scope where a board is named.

**Escalate** without it: only the person at the keyboard can refresh it. Escalate a topic's list, as one [outline](../human-output/references/chat.md#the-outline) by repository; Sweep waits on the person's confirmation or edits. **Stop** when nothing is in scope, or an Epic, Initiative or board cannot be read.

## Sweep

- One [`sdlc-sweep`](../../agents/sdlc-sweep.md) agent per repository, briefed as its [What you get](../../agents/sdlc-sweep.md#what-you-get) lists, with a scope that lists issues, the numbers in that repository, through [`parallelize`](../parallelize/SKILL.md), answered: no edges, no checks, done when every issue in scope the classes need, and every card the sweep reads, is read.

**Escalate** on a `short` line. **Stop** when a repository cannot be read.

## Read

- With `family` among the classes, one [`plan-review`](../../agents/plan-review.md) agent per open Epic and Initiative in scope, those on the list when the scope lists issues, else `gh issue list -R OWNER/REPO --search type:Epic,Initiative`, through `parallelize`, answered as Sweep.

**Stop** when an Epic cannot be read.

## Adopt

- With `orphan` or `family` among the classes, each `orphan` and `root` issue, and each child the Read stage finds outside its parent's goal, gets one of three: an existing parent, a parent to file, or none, with its reason.
- A parent is checked against its Initiative's non-goals, and against the board the issue's subtree would join.
- The proposals go to the delegator as one [outline](../human-output/references/chat.md#the-outline), keyed 📌 existing parent · 🔗 existing issue that moves here · ⭐ to file · 🌙 left without a parent.

**Escalate** the outline; nothing attaches before the delegator answers. Then `gh issue edit N --parent P` attaches each, an untyped issue takes its type, a new parent files per [`sdlc-capture`'s File](../sdlc-capture/SKILL.md#file), and [`sdlc-status --reset --apply`](../sdlc/SKILL.md#status) runs on each parent that gained a child.

## Act

- Run [`sdlc-setup.sh`](../sdlc/SKILL.md#setup) on each repository, each `TODO` it prints a `setup` flag, and [`sdlc-status --apply`](../sdlc/SKILL.md#status) on each board, which settles every `board` flag.
- An `untyped` Task or Bug takes the type the sweep names.
- An `uncarded` issue under an Initiative a Boards row names takes a card on that board, `gh project item-add`, then `sdlc-status --apply`.
- Every other flag escalates to the sweep's delegator, in the summary: a `ready` on an issue failing its form, its removal; a missing `ready`, [the hub's Frame](../sdlc/SKILL.md#phases); `unowned`, the assignee the sweep names; an `untyped` Epic or Initiative, its type; a `release-order`, a work blocker shipping in a later Release or a Release blocker not strictly earlier, within one repository: the move to the Release it names, the work it names moving too, a renumbering only as the delegator's call; a `no <field>` note, the value the sweep names for the nearest Epic's card, else its own, then `sdlc-status --apply`; any other `uncarded`, a card on the board the sweep names, then `sdlc-status --apply`; `setup`'s, and each `root` issue, as a question. A request that named a class's fix is the delegator's yes to it. It closes nothing.
- Its own writes go out a second apart: GitHub's secondary limit, which `gh api rate_limit` does not show, refuses a faster burst. A write GitHub refuses, but for a rate limit, is reported with its flag, and the rest go on.

**Stop** on a rate limit; a rerun once it resets skips what is written.

## Report

- Each Epic with questions, its children's among them, carries one comment headed `### sdlc-hygiene · Read: escalate`, a line `- [ ] <issue>: <question> → <direction>` per question.
- Once the delegator answers, each answer is commented on its Epic, and a family left with no question goes to its crew by a [handoff](../sdlc/SKILL.md#handoff), those answers its Decided.
- The stage's comment counts by class what was fixed and escalated.

**Escalate** while a flag or question waits on the delegator.

## Schedule

- The mapping's `sweep` cadence runs Precheck, Sweep and Read unattended: a script on the delegator's machine, where `gh` holds the `project` scope, run by cron.
- The script reads the mapping and each board's `sdlc-status` lines, then runs the stages in a sandbox that reaches only GitHub, on tools that only read, with none of the delegator's own settings. It posts the summary they print, or the step that failed, as one comment on an issue in a private repository.
- Sweep's briefs carry each repository's board lines, and say they stand in for `sdlc-status`, which the run cannot call. A check needing a command the run does not hold, such as the rate-limit fallback or a repository's own forms, is marked `not run` in the summary.
- Adopt, Act and Report wait for the delegator, in a session opened on that comment.
- The delegator runs the script once by hand, and reads the comment it posts, before the cron line goes in: that run is the check that `gh` keeps its login in the sandbox and the plugin loads.

```sh
PATH=/opt/homebrew/bin:/usr/local/bin:$HOME/.local/bin:/usr/bin:/bin
plugin=PATH/TO/PLUGIN
post() { gh issue comment N -R OWNER/PRIVATE "$@"; }
fail() { post --body "The scheduled sdlc-hygiene run failed: $1."; exit 1; }
GH_TOKEN=$(gh auth token) && export GH_TOKEN || exit 1
work=$(mktemp -d) files=$(mktemp -d) || exit 1
trap 'rm -rf "$work" "$files"' EXIT
cat > "$files/settings.json" <<'EOF'
{"permissions": {"blockReadsOutsideWorkingDirectories": true},
 "sandbox": {"enabled": true, "failIfUnavailable": true, "autoAllowBashIfSandboxed": false, "allowUnsandboxedCommands": false,
             "filesystem": {"allowRead": ["~/.config/gh"]},
             "network": {"allowedDomains": ["github.com", "api.github.com"], "strictAllowlist": true}}}
EOF
gh api -H 'Accept: application/vnd.github.raw' repos/OWNER/REPO/contents/PATH > "$files/mapping.md" || fail "reading the mapping"
for board in OWNER/N; do node "$plugin/scripts/sdlc-status.mts" "$board" --mapping "$files/mapping.md" || fail "sdlc-status on $board"; done > "$files/boards.txt"
cd "$work" && claude -p "Run sdlc-hygiene's Precheck, Sweep and Read on OWNER, and print the summary. The mapping is $files/mapping.md; each board's sdlc-status lines are in $files/boards.txt." \
  --restricted --strict-mcp-config --permission-mode dontAsk --settings "$files/settings.json" \
  --plugin-dir "$plugin" --add-dir "$files" "$plugin" --tools Agent,Bash,Read,Grep,Glob,Skill \
  --allowedTools Agent Read Grep Glob Skill 'Bash(gh auth status)' 'Bash(gh repo list *)' 'Bash(gh issue list *)' 'Bash(gh issue view *)' 'Bash(gh search issues *)' 'Bash(gh pr view *)' \
  --disallowedTools 'Agent(isolation:*)' > "$files/summary.md" && [ -s "$files/summary.md" ] || fail "claude -p"
grep -qF "$GH_TOKEN" "$files/summary.md" && fail "the summary held the gh token"
post --body-file "$files/summary.md"
```

Its cron line is `0 9 * * 1  sh PATH/TO/SCRIPT`, weekly being the default 7 days; every N days is `0 9 */N * *`. `PATH` names where `gh`, `node` and `claude` live, and `plugin` the installed plugin's versioned directory, which a plugin update makes stale.
