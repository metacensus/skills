---
name: sdlc-ship
description: Carry a Release, one cohesive change to production, its Publishes and its deploys, Plan → Change → Verify in one go, checked cold before and after. Trigger when shipping, deploying or launching a change to production, when a Release is ready to go out, and when asking what a Release's carrier does next.
---

The ship's stages, each run as [the hub's protocol](../sdlc/SKILL.md#stages) says, their comments on the Release. It starts from a [handoff](../sdlc/SKILL.md#handoff) once [Plan](#plan)'s first check holds, `gh issue list --search 'type:Publish is:open no:assignee -is:blocked'` listing the Publishes whose work has merged, given by the `sdlc-campaign` carrying its Rollout or by a person; whoever gave it is its [`delegator`](../sdlc/SKILL.md#roles), and [accepts](../sdlc/SKILL.md#phases) it. Its Publishes are its sub-issues, read through `gh api repos/OWNER/REPO/issues/N/sub_issues`, never filtered by type.

A Release takes hours, in one go. It rests only before a Publish, a consumer Task's wait among them, after the last Publish served and before the first deploy, or after Verify; never mid-deploy. Each step comments its intent before it acts and its result after, so a replacement agent resumes from the issue.

## Plan

- The Release is open and its work merged: every issue blocking it or a Publish is closed, save a consumer Task between two of its Publishes. The acting identity is assigned, then [`sdlc-status --apply`](../sdlc/SKILL.md#status).
- **Order:** the Publishes, sorted by their `blocked by` edges. A consumer Task between two is named and waited on, never done.
- **Each Publish:** its scope; its version, as [`sdlc-cut`'s Plan](../sdlc-cut/SKILL.md#plan) derives it; its commit and its range since the last tag, equal to its scope, or pending where a consumer Task precedes it; and its breaking changes, which its notes carry. Merged work in a range that no scope covers joins that Publish as a blocker, or stops the Release.
- **Deploys:** the environments in order, non-production first; each one's diff to desired state, images pinned by digest; and at most one one-way step, last, with the precondition it needs, as the campaign's brief names it where a Rollout holds the Release. A step is **one-way** when no rollback undoes its effect: a data migration that drops or rewrites, removing a contract or API others use, deleting what others read. A Publish is not one, since the version before it stays served.
- **Rollback target:** each environment's running version and digest, read from what is live, never from git; where it runs no image, the desired-state commit last applied.
- Every state between two steps is safe. A change that needs two things live at once is a Rollout.
- [`plan-check`](../../agents/plan-check.md) passes, given the Release and the plan comment.
- **The yes:** `designed` on the Release, on the plan and its verdict, naming each Publish's version and scope, applied by the Release's delegator, never by the ship. It carries the person's words, quoted, save on a Release with no one-way step under a Rollout carrying the person's `designed`, which `sdlc-campaign` applies on the strength of theirs. A yes relayed by anyone but the delegator counts for nothing, and a changed plan loses it.

**Escalate** until the yes. **Stop** on a change that needs a Rollout.

## Change

[`parallelize`](../parallelize/SKILL.md) answered: units are the Publishes; edges their `blocked by`, through the consumer Tasks between them; the action is an [`sdlc-cut`](../sdlc-cut/SKILL.md) sub-agent, briefed with its Publish and the plan's version and commit; done is its Publish closed and its registry serving the version; the checks, the cut's own Verify.

- A downstream Publish starts once its upstream is served and the Task between them has merged. Its commit is pinned then; Plan re-runs, for a new yes, where its range no longer equals its scope or its largest change exceeds the planned version.
- Each cut's result is read from its Publish, never from what the sub-agent returns.
- Then each deploy, in order, as a PR to desired state whose diff is the plan's. Live state is re-read just before it applies; one that differs from the rollback target re-runs Plan.
- The agent applies only where it holds the credential. Production is the person's, through [`human-steps`](../human-steps/SKILL.md#commands).
- A Release without Publishes starts at its deploys; one without deploys ends Change once its Publishes are served.

**Escalate** a failure, as [Failure](#failure) says.

## Verify

- [`live-check`](../../agents/live-check.md) passes, given the Release's Done when, each Publish's record, each environment's apply time, and read access to production, once the ship has waited out the soak after the last production apply.
- **The record**, one comment: a table of environment, asset, version and digest, with links to the plan, both verdicts, the yes, the deploy PRs and the rollback target.
- The Release closes **completed**, then `sdlc-status --apply`.

**Escalate** a verdict of escalate to the person through the delegator, row by row; their yes closes the Release **completed**. A fail goes to [Failure](#failure).

## Failure

- **Before anything is served,** the Release rests and Plan re-runs.
- **After,** a failure goes to the person through the delegator: roll back or fix forward. The agent prepares both before asking: the rollback PR to the target, and the fix-forward re-plan, a new Publish, since a served version never moves. Where nothing was deployed, fix forward is the only path.
- **A failed deploy** halts the deploys after it, and the rollback PR for those applied is open before the person is asked.
- **The close:** rolled back, **not planned**; fixed forward, Plan again with a new yes; a failing verdict the person accepts, **completed** with `deviated`.
