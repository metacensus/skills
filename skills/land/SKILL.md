---
name: land
description: Carry merged work to released: tagging a version, rerunning a failed run, verifying it at the registry, bumping its consumers. Trigger when tagging, rerunning, or verifying a release.
---

Landing ends when what merged is published and its consumers run it, or at the merge for work blocking an open Release, itself or through its Epic. Merging, and waiting on a run or an agent, are [`sdlc-author`'s Land](../sdlc-author/SKILL.md#land); first-publish order is [`dev-ci-github`'s](../dev-ci-github/SKILL.md#release-from-a-tag).

## 1. Release

- **A Release batches what blocks it**: a merge blocking an open one is not tagged on its own, `gh api repos/O/R/issues/I/dependencies/blocking --jq '.[] | select(.state == "open" and .type.name == "Release") | .title'` naming it for I, the issue the PR closes, else for I's parent Epic. The Release ships once nothing blocking it is open, `gh issue list --search 'type:Release -is:blocked no:assignee'` listing those; one under a Rollout ships as a child of the Rollout's [`sdlc-crew`](../sdlc-crew/SKILL.md) run.
- **Tag** as [Release from a tag](../dev-ci-github/SKILL.md#release-from-a-tag) says, the first release only once its first-publish order holds; [wait](../sdlc-author/SKILL.md#waiting) on the run.
- **A transient failure** (runner, registry 5xx, rate limit) reruns: `gh run rerun RUN --failed`. One a commit fixes merges the fix and cuts the next patch; a published tag never moves.
- **Publish is verified at the registry**, not the run: `npm view PKG@VER version`, `docker buildx imagetools inspect IMAGE:TAG`, `gh release view vX.Y.Z`.
- **Each consumer that pins it** (a dependency, an image tag or digest, a submodule) bumps in a PR of its own, carried through [`sdlc-author`](../sdlc-author/SKILL.md), done when its CI passes.

## 2. Done

One line per PR merged and per version published, each linked. On a Release they are its closing comment, and it closes **completed** once each consumer runs its version.
