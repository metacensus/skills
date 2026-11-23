---
name: start-ticket
description: Plan an issue's remaining work from its live state and pause before any of it runs. Trigger when the user says start ticket or hands over an issue to plan.
---

> Read the state, not the ticket.

Nothing is written, branched, or launched until the user says go.

## Resolve

`owner/repo#N`, `#N` in the current repository, or a URL. Ask only when none resolves.

## Gather

In parallel:

- The issue with its comments; a later comment supersedes the body.
- Each pull request, issue, and run it references: state, checks, merged or not.
- The repository: recent `main`, open pull requests and worktrees on related branches, latest tags and release runs.
- The files it names, and the external state its criteria name (a registry tag, a deployed version), checked directly.
- Where the repository has an `sdlc-mapping.md`, the checks of [`sdlc-author`'s Precheck](../sdlc-author/SKILL.md#precheck), read and not applied: no status apply, no comment.

## What is left

Each acceptance criterion is done, partial, or open, on the evidence. What is left is the open criteria and whatever the comments add: a review owed, a blocker, a "don't". Run its Verification block, if any, when cheap and read-only.

## Chunk

Chunks are [`parallelize`'s](../parallelize/SKILL.md) units, each with an owner:

- **agent** — runs alone.
- **person** — needs a person's hands: a console, a credential, an admin setting.
- **decision** — needs the user's call, and carries a recommendation.

Cheap de-risking, such as a dry run or a local build, comes before what cannot be undone. A step that publishes (push, pull request, tag, release, comment) is marked, and its agent stops before it.

## Report and pause

As [`sdlc`'s Reporting](../sdlc/SKILL.md#reporting) says, then stop:

```
owner/repo#N — title (url)
✅ criteria already met
1. 🔶 agent: outcome — done when check
2. 🩷 person: outcome — done when check
3. ⛔ decision: question — recommendation
Ready now: 1
```

## On go

The approved agent chunks run as `parallelize` says, in the background, each that edits in a worktree of its own; each brief adds the evidence gathered, and its remit stops before a marked step and at a decision. Each finishes into a report as [`sdlc`'s Reporting](../sdlc/SKILL.md#reporting) says. When all are done, the work goes on from [`sdlc-author`'s Self-review](../sdlc-author/SKILL.md#self-review) where mapped; elsewhere the Verification block runs and the user publishes.
