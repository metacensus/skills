---
name: sdlc-align
description: Find where an organization departs from a standard (a skill, pin, setting or file) and hand each fix to `sdlc-capture`. Trigger when a pin, label set, workflow, plugin install or repository setting must hold in several repositories, when asking which still lack one, and when asking whether the organization meets a skill.
---

A standard is a set of checks, and one probe answers both the survey and each fix's Verification, so "departs" and "fixed" cannot drift apart. The stages run as [the hub's protocol](../sdlc/SKILL.md#stages) says, commented on the asking issue, else to the session.

## Precheck

- The standard is named.
- Each of its checks becomes a **probe**: a read-only command run as the identity that will write, reading the default branch through the API, one per spelling (a Node pin in `.nvmrc`, `engines` and CI), such as `gh api "repos/$repo/contents/.nvmrc" -H 'Accept: application/vnd.github.raw' | grep -qx 22`. Where only judgment decides, as a skill's rules do, it becomes a **reading**.
- The scope is the repositories the request names, else the organization's.

**Stop** with no standard.

## Survey

- `${CLAUDE_PLUGIN_ROOT}/scripts/org-probe.sh OWNER|OWNER/REPO... -- PROBE` over the scope, `$repo` set to each `OWNER/REPO`: a line per repository, `conforms` or `departs`.
- A reading per repository a probe cannot settle, through [`parallelize`](../parallelize/SKILL.md), each returning places with evidence, path and line.
- The list: one line per place, repository · what departs · evidence · the fix; then the conforming repositories, and the skipped ones with their reason.

**Escalate** the list: the delegator confirms it, and it is the scope.

## Capture

- Each place files per [`sdlc-capture`](../sdlc-capture/SKILL.md#capture): one Task per repository, its title the same in every repository, its Verification the probe spelled for that repository.
- A label or setting is an action Task, its command and the probe before and after, as [`sdlc-author`](../sdlc-author/SKILL.md)'s Without a pull request says.
- Two or more places want an Epic: the asking one, else one escalated per `sdlc-capture`'s Type.
- Order is `blocked by`: a pilot repository first, and a repository others consume (a shared workflow, a template, a published package) before its consumers.

Run on a Spike, the confirmed list is its `Decision:`.
