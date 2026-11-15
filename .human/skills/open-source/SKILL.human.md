> Publishing cannot be undone, so the check runs before the push.

Fires: making a repo public, any commit, push, PR, issue or comment in a public repo, a leak, secret or license audit, "is this safe to push?"

```
mapping → review  Secrets → Examples → Leads → Licensing → Triage → Fix ↺
        → init    Secrets → Examples → Leads → Binaries → Licensing → Triage → Propose
```

⚠️ Internal is a kind of information, not a list. Examples help and never bound the check. [Leads](references/leads.human.md) drive it; scanners flag, the `open-source-triage` agent judges.

## The mapping

`open-source-mapping.md` binds the skill to an organization: one in a private repo, optionally one per project that links to it.

| Section | Rows hold |
|---|---|
| `## Licenses` | repo (`owner/name` or `forks`) · path glob · SPDX id or `upstream`; contributor and patent lines beneath |
| `## Leads` | a [default](references/leads.human.md) or own lead · where its examples live |
| `## Exceptions` | what is public despite a lead · where |

An absent section means no rows.

- Hole = undecided cell: ⛔ report it, never fill it.
- Project mapping over organization's: leads add, exceptions narrow, the project's row wins.
- A project mapping is public, so it names no examples.
- No mapping in the repo → ask the user where the organization's is.

## Two modes

| Mode | Fires on | Scope | Outcome | Page |
|---|---|---|---|---|
| init | repo about to go public, or public and under audit | every object ever held, coverage proven | organizes and proposes; ⛔ the user decides | [init](references/init.human.md) |
| review | change before it lands in a public repo | diff, commits, host text | 🟢 fixes, then tells | [review](references/review.human.md) |

Neither gives license advice of its own: [licensing](references/licensing.human.md).

## What a finding is

A flag triage judged real: location, lead, and the span only where the reader needs it.

| Rule | Means |
|---|---|
| ⚠️ Nothing public names a finding | report stays in the session or a private repo; fix commits, PRs and tests say only "remove an internal reference" |
| ⚠️ A secret is rotated | always; deletion does not disarm it |

## Questions worth asking

1. Did anything in this session come from somewhere private? A name read earlier gets written into a public commit unnoticed.
2. What else carries text here? Commit messages · branch and tag names · author identities · fixtures · filenames · images.
