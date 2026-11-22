---
name: open-source
description: Open-source a repository, or keep working in one that is public, without leaking internal information or drifting from its intended license. Trigger when making a repository public or open source, before any commit, push, pull request, issue, or comment in a public repository, when auditing one for leaks, secrets, or licensing, when porting a sample, a skill or a file from a private repository into a public one, and whenever the user asks whether something is safe to push or publish.
---

**Publishing cannot be undone**: copies spread within minutes of a push and no rewrite reaches them, so the check runs before the push.

**What is internal is a kind of information, not a list.** The check follows [leads](references/leads.md); examples help and never bound it. Every span a lead reaches is flagged before any is weighed, then each flag is judged in its context.

## The mapping

`open-source-mapping.md` binds the skill to an organization. The organization keeps one, in a private repository. A project may keep its own at its root, linking to the organization's, and the link is what makes it a project's.

- **`## Licenses`** — rows of a repository (backticked `owner/name`, or `forks` for every fork of another project), path globs (`**` the whole repository), and an SPDX id (or `upstream`, the parent's). Lines under it state contributor terms and patent stance.
- **`## Leads`** — rows of a lead, either one of the [defaults](references/leads.md#defaults) or the organization's own in a few words, and where its examples live, if anywhere: an MCP server's tools, or paths, in the mapping's repository unless prefixed `owner/name:`.
- **`## Exceptions`** — rows of what is public despite a lead, and where.
- **Hole** marks a cell or line undecided: report it, never fill it. A section the mapping lacks has no rows.

**A project's mapping is read over the organization's:** its leads add, its exceptions narrow, and where both state a row, the project's holds for that project. A project mapping in a public repository is itself public, so it names no examples.

If the repository under check has none, ask the user where the organization's is. Read a private one from a local clone whose `origin` is its repository, or with `gh api repos/<owner>/<name>/contents/<path>`.

## Three modes

- **init** — a repository about to go public, or one already public under audit: every object it has ever held, with coverage proven. It organizes what it finds and proposes; the user decides. [`sdlc-review`](../sdlc-review/SKILL.md#a-repository-going-public) runs it before the visibility change. [init.md](references/init.md).
- **review** — a change before it lands in a public repository: its diff, commits, and the text written for the host. Its scope is small, so it fixes and tells. [`sdlc-review`](../sdlc-review/SKILL.md#focus) runs it at a pull request's Review. [review.md](references/review.md).
- **port** — a sample taken from a private repository into a public one: only the sources the request lists, copied whole, then stripped. [port.md](references/port.md).

None gives license advice of its own. [licensing.md](references/licensing.md).

## What a finding is

A flag is real when it tells a reader something a lead reaches that is not public for this project. A public meaning clears it — a public dependency, an upstream project, the project's own public name, a mapping exception — and nothing else does. Doubt keeps it, marked as doubt.

A finding is a real flag: its location, its lead, and the span only where the reader needs it to act.

- **Nothing public names a finding.** The report stays in the session or a private repository; a fix's commit, pull request, and tests carry no found span — "remove an internal reference" is the whole account.
- **A secret is rotated** whatever else is decided; rotation disarms it and deletion does not.

## Questions worth asking

- **Did anything in this session come from somewhere private?** A name read an hour ago in a private record is the one an agent writes into a public commit without noticing.
- **What else carries text here?** Commit messages, branch and tag names, author identities, fixtures, filenames, images.
- **Where else did this text go?** A finding in a file copied from a template is in the template and every repository it seeded.
