> A sweep finds drift in an organization's issues, labels and boards from the `sdlc` lifecycle, fixes what it may, and escalates the rest.

Fires: grooming, sweeping or cleaning a backlog or board; what went stale or drifted; what is left to decide.

Runs each stage per [the hub's protocol](../sdlc/SKILL.human.md#stages); comments go to the session.

```
Precheck → Sweep → Read → Adopt → Act → Report
              │       │      │      │
          per repo  per Epic  outline  setup + board
          (sweep)   (family)  to delegator  fixes
```

Key: ⛔ escalate · 🛑 stop · 🔗 existing issue moves here · 📌 existing parent · 🆕 to file · ⏸️ no parent

| Stage | Runs | Escalates ⛔ | Stops 🛑 |
|---|---|---|---|
| Precheck | scope, mapping, forms, auth | no `project` scope | no repo in scope · Epic unreadable |
| Sweep | one `sdlc-sweep` per repo | a `short` line | repo unreadable |
| Read | one `sdlc-family` per open Epic / Initiative | · | Epic unreadable |
| Adopt | parent proposals as one outline | the outline; nothing attaches first | · |
| Act | setup, board status, flag routing | every other flag | GitHub refuses a write |
| Report | one comment per Epic with questions | while a flag or question waits | · |

## Precheck

| Input | Source, first that holds |
|---|---|
| Scope | 1 the user's Epic (its family: Epic + sub-issues, and their repos) · 2 repos the user names · 3 the org's unarchived repos with issues on |
| Boards | mapping's Boards rows |
| Thresholds | mapping's Cadence rows |
| No mapping | ask the user where it is; take boards and forms from the answer |
| Forms | each repo's, found by [Setup](../sdlc/SKILL.human.md#setup), else the hub's `forms/`; give each type's required fields |
| Auth | `gh auth status` holds `project` where a board is named |

```
gh repo list OWNER -L 1000 --no-archived --json name,hasIssuesEnabled
gh api repos/OWNER/REPO/issues/N/sub_issues --paginate
```

⛔ no `project` scope: only the person at the keyboard can refresh it. 🛑 no repo in scope, or the Epic cannot be read.

## Sweep

```
repo → sdlc-sweep agent (via parallelize) → flags
```

- One [`sdlc-sweep`](../../agents/sdlc-sweep.human.md) per repo, briefed per its [What you get](../../agents/sdlc-sweep.human.md#what-you-get); for an Epic, the family's numbers in that repo.
- Run through [`parallelize`](../parallelize/SKILL.human.md), answered: no edges, no checks.
- Done when every open issue in scope and every card the sweep reads is read.

⛔ a `short` line. 🛑 a repo cannot be read.

## Read

```
gh issue list -R OWNER/REPO --search type:Epic,Initiative
```

- One [`sdlc-family`](../../agents/sdlc-family.human.md) per open Epic and Initiative in scope; the search is skipped when the Epic is the scope.
- Through `parallelize`, answered as Sweep.

🛑 an Epic cannot be read.

## Adopt

```
orphan · root · child outside its parent's goal
   → pick one → check → outline ⛔ → attach
```

| Pick | Mark |
|---|---|
| existing parent | 📌 |
| existing issue that moves here | 🔗 |
| parent to file | 🆕 |
| none, with its reason | ⏸️ |

- Check each parent against its Initiative's non-goals and the board its subtree would join.
- Proposals go to the delegator as one [outline](../human-output/references/chat.human.md#the-outline).

⛔ the outline; nothing attaches before the delegator answers.

Then:

| After the answer | Action |
|---|---|
| attach | `gh issue edit N --parent P` |
| untyped issue | takes its type |
| 🆕 parent | via [`sdlc-intake`](../sdlc-intake/SKILL.human.md) |
| each parent that gained a child | [`sdlc-status --reset --apply`](../sdlc/SKILL.human.md#status) |

## Act

| Flag | Handled by |
|---|---|
| `setup` (each `TODO`) | [`sdlc-setup.sh`](../sdlc/SKILL.human.md#setup) per repo |
| `board` | [`sdlc-status --apply`](../sdlc/SKILL.human.md#status) per board |
| `ready` on an issue failing its form | ⛔ removal, to the delegator |
| label no role names | ⛔ removal, to the delegator |
| missing `ready` | ⛔ [`sdlc-intake` curation](../sdlc-intake/SKILL.human.md#curate) |
| `setup`'s remainder | ⛔ question |
| `root` issue | ⛔ question |

Every ⛔ goes in the sweep's summary. It closes nothing.

🛑 GitHub refuses a write.

## Report

| Where | What |
|---|---|
| Each Epic with questions (children's included) | one comment headed `### sdlc-hygiene · Read: escalate`, a line per question: `- [ ] <issue>: <question> → <direction>` |
| The stage's comment | counts by class: fixed · escalated |

⛔ while a flag or question waits on the delegator.
