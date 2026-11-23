---
name: sdlc-hygiene
description: Sweep an organization's issues, labels and boards for drift from the `sdlc` lifecycle, fixing what it may and escalating the rest. Trigger when grooming, sweeping or cleaning up a backlog or board, when asking what has gone stale or drifted or what is left to decide, after a pivot, and when scheduling the sweep.
---

The hygiene stages, each run as [the hub's protocol](../sdlc/SKILL.md#stages) says: an escalation or stop goes to the session as it arises, and the rest is said once, in [the summary](#act).

A list of issues, boards or repositories reaches a loop or a command a line at a time, `gh issue list ... --jq '.[].number' | while read -r n; do gh issue edit "$n" ...; sleep 1; done`, or as words written out, never through an unquoted variable, which zsh passes whole as one word.

## Precheck

| Scope | The request names | Issues |
|---|---|---|
| Epic | an Epic | its family, the Epic and its sub-issues, `gh search issues -L 1000 -- 'parent-issue:OWNER/REPO#N'` |
| Initiative | an Initiative | its family two levels deep, the Initiative, its Epics and their children, by the same search run on the Initiative and then on each Epic it returns |
| board | one or more boards, `OWNER/N` | each card's issue and its Initiative, the first and fourth columns of [`sdlc-status`](../sdlc/SKILL.md#status) `OWNER/N --mapping PATH`, and its parent, `gh issue list -R OWNER/REPO --state all -L 1000 --json number,parent` |
| topic | a topic, in words that select no class | what its searches match, `gh search issues --owner OWNER -L 1000 --json repository,number,title,state -- QUERY`, each word its own argument, each exclusion a `-repo:` or `-label:` qualifier |
| repositories | repositories | every issue in them |
| organization | none of these | every issue in its unarchived repositories with issues on, `gh repo list OWNER -L 1000 --no-archived --json name,hasIssuesEnabled`, and with `wrong-home` taken, the open issues of its archived ones, `--archived`, swept for `wrong-home` alone |

The scope is the first row that holds. The first four list issues, each with its repository, and any scope drops what the request excludes.

- The boards are the mapping's Boards rows, and the thresholds its Cadence rows. With no mapping, ask the user where the organization's is, and take boards and forms from the answer.
- The classes are the [sweep's](../../agents/sdlc-sweep.md#what-you-do) and Read's `family` and `body-drift`: those the request names, by name or by a word for what a class checks, less those it excludes, else all. "Relationships" selects `orphan`, `misparented` and `family`.
- Each repository's forms, wherever [Setup](../sdlc/references/setup.md) finds them, else the hub's [`forms/`](../sdlc/forms/), yield each type's required fields.
- `gh auth status` holds the `project` scope where a board is named.
- A read that returns nothing, here or as a sweep's `read`, is checked against a count read another way before its scope is called clean: an Epic's or Initiative's sub-issues, `gh issue view <url> --json subIssuesSummary`; a board's items, `gh project view N --owner OWNER --format json --jq .items.totalCount`; a repository's open issues, `gh repo list OWNER -L 1000 --json name,issues --jq '.[] | select(.name == "REPO") | .issues.totalCount'`; for a sweep given a list, its numbers. Above zero, the read is `short`.

**Escalate** without it: only the person at the keyboard can refresh it. Escalate a `short` read. Escalate a topic's list, as one [outline](../human-output/references/chat.md#the-outline) by repository; Sweep waits on the person's confirmation or edits. **Stop** when nothing is in scope, or an Epic, Initiative or board cannot be read.

## Sweep

- One [`sdlc-sweep`](../../agents/sdlc-sweep.md) agent per repository, briefed as its [What you get](../../agents/sdlc-sweep.md#what-you-get) lists, with a scope that lists issues, the numbers in that repository, through [`parallelize`](../parallelize/SKILL.md), answered: no edges, no checks, done when every issue in scope the classes need, and every card the sweep reads, is read.

**Escalate** on a `short` line. **Stop** when a repository cannot be read.

## Read

- With `family` or `body-drift` among the classes, one [`design-check`](../../agents/design-check.md) agent per open Epic and Initiative in scope, `body-drift` alone keeping only that finding, those on the list when the scope lists issues, else `gh issue list -R OWNER/REPO --search type:Epic,Initiative`, through `parallelize`, answered as Sweep.

**Stop** when an Epic cannot be read.

## Adopt

- With `orphan` or `family` among the classes, each `orphan` and `root` issue, and each child the Read stage finds outside its parent's goal, gets one of three: an existing parent, a parent to file, or none, with its reason.
- A parent is checked against its Initiative's non-goals, and against the board the issue's subtree would join.

**Escalate** each proposal as a line of Act's list, under the parent it proposes; nothing attaches before the delegator answers. Then `gh issue edit N --parent P` attaches each, an untyped issue takes its type, a new parent files per [`sdlc-capture`'s File](../sdlc-capture/SKILL.md#file), and [`sdlc-status --reset --apply`](../sdlc/SKILL.md#status) runs on each parent that gained a child.

## Act

A request for a sweep is the delegator's yes to the fixes below, as [a request to pick an issue up](../sdlc/SKILL.md#roles) is to assigning. Act writes unasked only to the issues in scope, and on a board scope to no other board's cards: an `uncarded` issue whose board is outside it goes to the list.

- With repositories or the organization as the scope, [`sdlc-setup.sh`](../sdlc/references/setup.md) runs on each repository, each `TODO` it prints a `setup` flag.
- [`sdlc-status --apply`](../sdlc/SKILL.md#status) runs on each board the scope names, on every board for the organization, else on the scope's issues, `OWNER/REPO#N...`, and settles every `board` flag.
- Seven flags take the value the sweep names: an `untyped` issue its type; `unowned` its assignee; a `ready` on an issue failing its form comes off; a closed issue's `ready` or `designed` comes off; a `cycle` naming one edge, to the issue's own ancestor, loses it, `gh issue edit N --remove-blocked-by M`; a `no <field>` note's value goes on the nearest Epic's card in scope, else its own; an `uncarded` issue under an Initiative a Boards row names gets a card on that board, `gh project item-add`. Then `sdlc-status --apply` runs again as above, on the issues it touched but for a board scope.
- Every other flag goes up in one list with Adopt's proposals and Read's questions, a yes/no line apiece naming its fix, all answered in one reply: a missing `ready`, [the hub's Frame](../sdlc/SKILL.md#phases); a `publish-order`, a work blocker shipping in a later Publish or a Publish blocker not strictly earlier, within one repository: the move to the Publish it names, the work it names moving too, a renumbering only as the delegator's call; a `deadlock`, each other child it names added as the Publish's or Release's blocker, `gh issue edit P --add-blocked-by T`, then the Epic's edge removed, `--remove-blocked-by E`, or, with no other open child, no move, the edge left for the delegator so the Publish or Release is never unblocked; any other `uncarded`, a card on the board the sweep names; an `unanswered`, the question its comment asks; a `cycle`, the edge to drop, picked from those it names; a `wrong-home`, the move, `gh issue transfer N OWNER/DEST`, then the type, parent and cards `gh issue view <url> --json issueType,parent,projectItems` read before it, restored on the new issue by `gh issue edit` and `gh project item-add`; a `duplicate`, the second closed as a duplicate of the first; a `stale-pr`, closing it, its branch kept; a `leak`, the span rewritten without the name, then the person deleting the earlier revision from its edit history, at its link; a `mapping-drift`, a Task filed per [`sdlc-capture`](../sdlc-capture/SKILL.md#file) where the mapping lives, naming the row and its value; an `uncaptured`, the work filed per `sdlc-capture` under the parent it names; a `closed-early`, each box ticked where a closing PR merged, else the issue reopened naming the boxes; a `body-drift`, the body amended as its line says; `setup`'s, and each `root` issue. A yes is written as its line says; a no leaves the issue as it is.
- Before the list goes up, each line's issue is read, `gh issue view <url> --json state,comments`, or its pull request, `gh pr view <url> --json state,comments`, and a Read question's Epic, where it is asked. A line goes when its issue is closed, but for a class the sweep reads closed issues for, or when a comment there already answers it: a reply after its question, or a Report comment that answered the same class and fix. An `unanswered` line on this skill's own Read comment goes too: Read's line asks it.
- The list goes up as the summary, one [outline](../human-output/references/chat.md#the-outline): its outcome names the scope, the classes taken, and the run as a check of issues, labels and boards; one line counts Act's own fixes by class; then one line per issue left, under its Epic under its Initiative, each heading naming its type, an issue under neither in a group of its own. A class goes by what it checks, never by its name alone, and each line carries the issue's title, what drifted and the fix a yes writes, its link at the end, `mark title · #N`, so it reads without opening the issue.
- After the outline, the commands a person runs, one per line, by repository: each `merged-branches` deletion, `gh api -X DELETE repos/OWNER/REPO/git/refs/heads/BRANCH`, and each `wrong-home` in an archived repository, its move between `gh repo unarchive OWNER/REPO --yes` and `gh repo archive OWNER/REPO --yes`.
- A request naming a class's fix, a standing grant among them only where the request quotes it, answers that class's lines yes, but never a choice of goal, scope or parent, or anything irreversible: those stay in the list.
- It closes no issue: a yes to a close is commented on the issue, for its carrier's Land or Close, else the delegator, to make.
- Its own writes go out a second apart: GitHub's secondary limit, which `gh api rate_limit` does not show, refuses a faster burst. A write GitHub refuses, but for a rate limit, is reported with its flag, and the rest go on.

**Stop** on a rate limit; a rerun once it resets skips what is written.

## Report

- Each Epic with questions, its children's among them, carries one comment headed `### sdlc-hygiene · Read: escalate`, a line `- [ ] <issue>: <question> → <direction>` per question, worded as its summary line, but for one an unanswered comment there already asks.
- In the turn the delegator answers, each answer given is commented where its question is asked, a Read question's Epic, else the line's issue: one comment per issue headed `### sdlc-hygiene · Report: pass`, a line `- <question> → <answer>` apiece, a `leak`'s naming no private repository. Then a family left with no question goes to its crew by a [handoff](../sdlc/references/handoff.md), those answers its Decided.
- The stage's comment counts by class what the answers wrote, in [`human-output`](../human-output/SKILL.md)'s shape, as the summary's count line does.

**Escalate** while a flag or question waits on the delegator.

## Schedule

- The mapping's `sweep` cadence runs Precheck, Sweep and Read unattended: a script on the delegator's machine, where `gh` holds the `project` scope, run by cron.
- The script reads the mapping and each board's `sdlc-status` lines, then runs the stages in a sandbox that reaches only GitHub, on tools that only read, with none of the delegator's own settings. It posts the summary they print, Act's own fixes counted as due, or the step that failed, as one comment on an issue in a private repository.
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
  --allowedTools Agent Read Grep Glob Skill 'Bash(gh auth status)' 'Bash(gh repo list *)' 'Bash(gh issue list *)' 'Bash(gh issue view *)' 'Bash(gh search issues *)' 'Bash(gh pr view *)' 'Bash(gh pr list *)' 'Bash(gh project view *)' 'Bash(gh release view *)' 'Bash(read *)' 'Bash(sleep *)' \
  --disallowedTools 'Agent(isolation:*)' > "$files/summary.md" && [ -s "$files/summary.md" ] || fail "claude -p"
grep -qF "$GH_TOKEN" "$files/summary.md" && fail "the summary held the gh token"
post --body-file "$files/summary.md"
```

Its cron line is `0 9 * * 1  sh PATH/TO/SCRIPT`, weekly being the default 7 days; every N days is `0 9 */N * *`. `PATH` names where `gh`, `node` and `claude` live, and `plugin` the installed plugin's versioned directory, which a plugin update makes stale.
