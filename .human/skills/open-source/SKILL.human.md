> Publishing cannot be undone, so the check runs before the push.

Fires: going public; any commit, push, PR, issue or comment in a public repo; leak or license audit.

⚠️ Internal is a kind of information, not a list. [Leads](references/leads.human.md) drive the check; scanners flag, `open-source-triage` judges.

| Mode | Scope | Outcome |
|---|---|---|
| [init](references/init.human.md) | every object ever held | ⛔ the user decides |
| [review](references/review.human.md) | diff, commits, host text | 🟢 fixes, then tells |

`open-source-mapping.md`, one per organization in a private repo, holds:

| Section | Rows |
|---|---|
| `## Licenses` | repo · glob · SPDX id ([licensing](references/licensing.human.md)) |
| `## Leads` | lead · examples |
| `## Exceptions` | public despite a lead |

Hole: ⛔ report, never fill. Project row wins. No mapping → ask.

⚠️ Nothing public names a finding; a secret is rotated, since deletion does not disarm it.
