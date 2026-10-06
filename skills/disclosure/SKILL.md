---
name: disclosure
description: Keep internal information out of a repository that is or will be public, and its licensing as the organization intends. Trigger when making a repository public or open source, when auditing one that is, before anything lands in a public repository — a diff, branch, commit, pull request, issue, or their text — and whenever the user asks whether something is safe to publish.
---

**Publishing cannot be undone.** A public repository is cloned, forked, cached, and scanned for secrets within minutes of a push, and a history rewrite reaches none of those copies. So the check runs before the push.

**A leak is a word.** Nearly every one is a term a list could name, in one of the [categories](references/terms.md#categories). Finding it is matching, not reasoning, so deterministic tools run first, the cheapest model reads what they cannot, and the strongest model in the session only triages.

## The mapping

Each organization binds the skill in `disclosure-mapping.md`, kept once in a private repository, because what it points at must stay private. A public repository holds at most a link to it.

- **`## Licenses`** — rows of a repository (backticked `owner/name`, or `forks` for every fork of another project), path globs (`**` the whole repository), and an SPDX id (or `upstream`, the parent's). Lines under it state contributor terms and patent stance.
- **`## Terms`** — rows of a [category](references/terms.md#categories), source paths in the mapping's repository, and the fields whose values are terms (none: the whole source is read).
- **Hole** marks a cell or line undecided: report it, never fill it.

To find it, read `disclosure-mapping.md` at the root of the repository under check — the mapping, or a link to it — or ask the user where the organization's is. Read it and its sources from a local clone whose `origin` is that repository, or with `gh api repos/<owner>/<name>/contents/<path>`.

## Two modes

- **init** — a repository about to go public, or one already public under audit: every object it has ever held, with coverage proven. [init.md](references/init.md).
- **review** — a change before it lands in a public repository: its diff, commits, and the text written for the host. [review.md](references/review.md).

Neither gives license advice of its own. [licensing.md](references/licensing.md).

## What a finding is

A hit the triage judged real: its location, its category, and the term only where the reader needs it to act.

- **Nothing public names a finding.** The report stays in the session or a private repository; a fix's commit, pull request, and tests carry no found term — "remove an internal reference" is the whole account.
- **In review, it is fixed before it lands.** In init, the user decides: remove it going forward, rewrite history, or withhold the repository.
- **A secret is rotated** whatever else is decided; rotation disarms it and deletion does not.

## Questions worth asking

- **Did anything in this session come from somewhere private?** A name read an hour ago in a private record is the one an agent writes into a public commit without noticing.
- **What else carries text here?** Commit messages, branch and tag names, author identities, fixtures, filenames, images.
- **Which objects did the scan not read?**
