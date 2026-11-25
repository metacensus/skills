---
name: sdlc-cut
description: Carry a Publish from its plan to served — one repository's artifact or desired state at one version, tagged at a pinned commit, built by CI or applied, read back from where it serves. Trigger when cutting, tagging or publishing a version, when a Release starts a cut or a person hands over a Publish, when a release run fails, and when checking what a registry serves.
---

The cut's stages, each run as [the hub's protocol](../sdlc/SKILL.md#stages) says, their comments on the Publish. Its [`delegator`](../sdlc/SKILL.md#roles) is whoever started it: an `sdlc-ship` run under a Release, else the person who handed it the Publish. A Publish takes minutes; it is [one-way](../sdlc-ship/SKILL.md#plan) only where a desired-state plan names a one-way step. Under a Release it has no gate of its own: the Release's yes covers its tag, and a cut never asks a person for a yes.

Each stage first checks whether its result already holds, and then does not act again. Plan's comment is Change's intent and Change's is Verify's, so a replacement agent resumes from the last comment and what the world shows.

## Kinds

Each repository's kind is its row in [`sdlc-mapping.md`](../sdlc/references/mapping.md), and the flow branches on it:

| Kind | Survey | Served when | Credential | After it |
|---|---|---|---|---|
| Library | the API diff | the registry serves the version | CI | consumers adopt, each by a Task |
| Image | the change range | the registry serves the digest | CI | a deploy or an apply Publish |
| Plugin or skills | the change range | the marketplace lists the version | CI | consumers update, only on a version change |
| Desired state, one Terraform root | the plan | the live plan is empty | the person, for production | nothing: it is the change |

## Plan

- The Publish is open, a Release holds it or a person handed it over, and every issue blocking it is closed. The acting identity is assigned, then [`sdlc-status --apply`](../sdlc/SKILL.md#status).
- **The commit** is the last merge of its scope on the default branch: the work that blocks the Publish, and an Epic's Tasks through it.
- **The range**, from the last tag to the commit, equals the scope: each PR merged in it closes work in scope.
- **The version** a person names wins; the rule only proposes one, bumping the last tag by the largest change in the range: breaking is major, a feature minor, anything else patch. Below 1.0.0 breaking is minor, and 1.0.0 is cut only where the yes names it. A Go major past v1 has its `/vN` module path in the range.
- Under a Release, the version and the commit are those the ship's brief names.
- **The tag**, at the grain its mapping row names, is free on `origin`, or already on the commit, read as Verify's last row reads it, which means Change resumes at its run.
- **The notes** are drafted from the range's PRs: breaking changes with their migration, then features, then fixes.
- A first publish waits on [`dev-ci-github`'s first-release setup](../dev-ci-github/SKILL.md#release-from-a-tag).
- **The survey** is the comment, and what a yes is given on: the version, the commit and the range; the notes; its kind's survey; what comes after it, as its kind says, each with what it must do, a consumer's as the adopt Task the Publish blocks; and what the tag sets in motion, the CI run and what serves a version that, once served, never moves.

**Escalate** a lone Publish's survey until its yes, one an agent started with no Release, a repository its mapping gives no kind, and a PR in the range outside the scope. **Stop** on the tag already on another commit, and, under a Release, on a version or commit the brief does not name.

## Change

- `designed`, a person's yes, is given on this Publish's survey, at its version and scope: in the Release's plan, else in Plan's comment, the yes after it.
- The agent tags the commit and pushes the tag, as [Release from a tag](../dev-ci-github/SKILL.md#release-from-a-tag) says, and the credential its kind names publishes: CI from the tag, never a workstation, or, for desired state in production, the person applying at the tag through [`human-steps`](../human-steps/SKILL.md#commands).
- The run ends green, [waited on](../sdlc-author/SKILL.md#waiting), and the comment links it with the digest or integrity hash it printed. A transient failure (a runner, a registry 5xx, a rate limit) reruns: `gh run rerun RUN --failed`.

**Escalate** a cut without that yes, and a run that fails otherwise: the tag never moves, so a fix a commit makes ships as a new Publish.

## Verify

- It is served as its kind says, at CI's digest or hash where CI built it, read from a clean client: no cache, and no credentials beyond those its intended reader holds.

  | Artifact | Read | Equals |
  |---|---|---|
  | npm package | `npm view PKG@VER dist.integrity --cache "$(mktemp -d)" --userconfig "$(mktemp)"` | the run's integrity |
  | image | `docker buildx imagetools inspect IMAGE:VER` | the run's digest |
  | Go module | `GOMODCACHE="$(mktemp -d)" GOPROXY=https://proxy.golang.org GOFLAGS=-mod=mod go list -m MOD@VER` | served, and `sum.golang.org/lookup/MOD@VER` holds it |
  | served from its tag | `git ls-remote origin refs/tags/VER "refs/tags/VER^{}"` | the commit, on the `^{}` line where one prints |
  | desired state | `terraform -chdir=ROOT plan -detailed-exitcode` at the tag | exit 0: no changes |

- The GitHub Release on the tag carries the notes: `gh release create VER --verify-tag --notes-file F`, or `gh release edit` where CI made one.
- The comment is the record: version, commit, digest and the GitHub Release's link. The Publish closes **completed**, then `sdlc-status --apply`.

**Escalate** a registry serving another digest, or none once the run has ended, and a live plan not empty once the apply has ended.

## Fix forward

A served version is never re-tagged or overwritten. A bad one goes up, and the Publish its delegator files to replace it retires it: `npm deprecate`, a Go `retract` in the new version, an image never deployed.
