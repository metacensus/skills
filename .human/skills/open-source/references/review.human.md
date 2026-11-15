> A change fits one context, so review needs no fan-out: find, fix, tell.

Fires: before a change lands in a public repo. Part of [open-source](../SKILL.human.md).

```
Secrets → Examples → Leads → Licensing → Triage → Fix
   ↑                                                 │
   └──────── run again until nothing real ───────────┘
```

## What is in scope

| Scope | Covers | Read with |
|---|---|---|
| Added lines | diff, plus staged and untracked files; new files in full | `git diff <base>...HEAD` |
| Commits | messages, author and committer identities | `git log <base>..HEAD` |
| Names | branch, any tag | · |
| Host text | PR title and body, issue, comment, release notes; read as a draft before posting | · |

## Order

| # | Step | How | Only when |
|---|---|---|---|
| 1 | Secrets | `gitleaks git --log-opts="<base>..HEAD"`; `gitleaks dir` for uncommitted | always |
| 2 | Examples | text through `grep -F -i -f <(cut -f2 examples)` | examples exist |
| 3 | Leads | one `open-source-scan` over the same text, one batch file; ✅ `unread:` empty | always |
| 4 | Licensing | against [licensing](licensing.human.md) | change adds a dependency, license file, manifest, or outside code |
| 5 | Triage | `open-source-triage` over flags, added binaries, licensing findings | always |
| 6 | Fix | then repeat; ✅ nothing real found | always |

## Fixing

🟢 Fix, then tell the user what changed. An unpushed commit is the change's own: amend or rebase until no commit carries the span.

| When | Then |
|---|---|
| span has several fair replacements | ⛔ ask |
| fix edits what the change did not touch | ⛔ ask |
| commit already pushed | ⛔ ask: PR refs keep it, so rewriting is the user's call |
| otherwise | 🟢 fix and tell |
