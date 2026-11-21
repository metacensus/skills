---
name: checkout
description: Start work from current main, in a worktree and branch of its own. Trigger when picking up an issue or starting any change in a shared repository, before the first edit, and whenever the user says they want to start, pick up, branch, or check out.
---

A change cut from a stale base is reviewed against code that no longer exists, and its conflicts land on whoever merges it. [`checkin`](../checkin/SKILL.md) closes the change; this opens it.

## 1. Start from current main

`git fetch origin`, then cut from `origin/<default>` (`gh repo view --json defaultBranchRef`), never the local default branch: it is as old as its last pull. A branch resumed rather than cut syncs per [`checkin`'s Sync](../checkin/SKILL.md#6-sync-with-main) before the first edit.

## 2. A worktree per change

`git worktree add <path> -b <branch> origin/<default>`. A worktree the harness made is yours, but check its base: `git rev-list --count HEAD..origin/<default>` is 0, or it syncs.

## 3. Name the branch

**`<your-name>/<topic>`**, `alex/retry-backoff`: the owner prefix says whom to ask about a stale branch, and the topic names the change's subject rather than a ticket or the tool that made it. An environment that pushes only under a fixed prefix (`claude/…`) keeps that prefix, the topic after it. Rename (`git branch -m`) a harness-assigned name before the first push.

## 4. Stay inside

Run commands from the worktree root, with absolute paths; never `cd` into another checkout or edit its files, the main checkout among them. The stash stack is shared across worktrees: set work aside in a WIP commit, not `git stash`.
