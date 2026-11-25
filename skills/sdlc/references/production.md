# Production

The tiers that change production, beside [the ladder](../SKILL.md#the-ladder)'s code tiers. Read when work ships in, adopts, or is blocked by a Publish, Release or Rollout, and when one is planned.

## The tiers

| Jira | GitHub | Notes |
|---|---|---|
| **Publish** (version) | Issue `type: Publish` | Task tier: one repository's artifact, or its desired state, out at one version, carried by [`sdlc-cut`](../../sdlc-cut/SKILL.md). Its parent is a Release where one is needed; else it stands alone, handed over by a person, its yes `designed` on it, and its adoption tracked by its consumers' adopt Tasks. The work it ships blocks it. |
| **Release** (cross-project release) | Issue `type: Release` | Epic tier, optional: one cohesive change to production, its Publishes plus deploys in one go, carried by [`sdlc-ship`](../../sdlc-ship/SKILL.md). Used where its Publishes, code and apply, must hold their order or rollback as one change, or a version's yes or adoption needs a record of its own: a cold `plan-check`, or a Done when for `live-check`. Its parent, if any, is a Rollout. |
| **Rollout** | Issue `type: Rollout` | Initiative tier, optional, used only where Releases need ordering: Releases with time and conditions between them, carried by [`sdlc-campaign`](../../sdlc-campaign/SKILL.md). No parent. |

| Edge | From → to | Kind |
|---|---|---|
| parent | Release → Rollout · Publish → Release | child → parent |
| ships | Publish → the Epic it ships, or its Tasks where they ship apart | `blocked by` |
| adopts | a consumer's Task → the Publish it adopts | `blocked by` |

A Publish's parent, if any, is a Release, and a Release's, if any, a Rollout; a Rollout takes none, and none of the three parents work. A Publish files in the repository it publishes; a Release or Rollout, as an Initiative does.

## Shipping

Work relates to a Publish, Release or Rollout by `blocked by` alone. A Publish is blocked by the work it ships, an Epic by default and a Task only where that Epic's Tasks ship in different Publishes; work ships in the Publish it blocks, else its Epic's, and work a Release needs merged that none of its Publishes ships blocks the Release itself. A Publish closes once it is served as [its kind](../../sdlc-cut/SKILL.md#kinds) says. An apply is a Publish of desired state: one Terraform root out at a semver-tagged version, served once the live plan is empty. A Task changing desired state closes on merge, as code does, and blocks that apply Publish; work needing the applied effect, a step that can only run after the apply among it, is blocked by that Publish, never folded into a gate Task a Release waits on. Adopting a version is a consumer's Task blocked by that Publish, an edge and not a type; other work that must follow a Publish is blocked by it too, or by its Release when the whole Release must be live first, and a direct edge between two works stays beside one through a Publish. The deadlock rule: an Epic that blocks a Publish, or its Release, holds no work blocked by either, since neither could close first; otherwise the edges move to its Tasks. Work joins a Publish by blocking it, the work's carrier adding the edge. A Publish's version is fixed once its issue exists, and new versions are appended, so work that cannot ship in one moves to a later one, and the work it blocks moves with it. Renumbering a planned version is rare, and its delegator's call once it has weighed what moves: the work aimed at that version and anything already announced or tagged. An Initiative mentions each Release its work ships in and is never blocked by a Publish, Release or Rollout: [its close](../../sdlc-fleet/SKILL.md#close) waits on the Publishes its descendants block and, where a Release holds one, on that Release.

## Joining a Publish

Work joins the earliest open Publish that holds, filing the next version when none does: a blocker that is work ships in that Publish or an earlier one, and a blocker that is a Publish is strictly earlier. Versions compare only within one repository. Where its own change moves it to a later Publish, the work it blocks moves too.

## Phases

A production tier runs Plan, asking what should be live, then Change, then Verify, asking whether it is live as planned; they hand on, in turn, the plan, the digests and the verdict.

| Tier | Delegator | Carrier |
|---|---|---|
| Publish | `sdlc-ship`, else a person | `sdlc-cut` |
| Release | `sdlc-campaign`, else a person | `sdlc-ship` |
| Rollout | a person | `sdlc-campaign` |
