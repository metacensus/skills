> A ship carries one Release: its Publishes, then its deploys, in one go, checked cold before and after. Hours; it rests only before a Publish, between Publishes and deploys, or after Verify. Started by `sdlc-campaign` or a person once its Publishes' work has merged: its delegator, who accepts it.

Fires: shipping, deploying or launching to production; a Release ready to go out.

```
Plan → ⛔ yes → Change → Verify
```

|Stage|Holds|⛔|🛑|
|---|---|---|---|
|Plan|work merged; Publish order; each scope, version, range = scope (pending behind a consumer Task), breaking changes; deploys, non-production first, one one-way step at most, last; rollback target from live; every state safe; `plan-check` passes|until the yes, `designed`|needs a Rollout|
|Change|a cut per Publish, downstream once upstream is served; then each deploy as a PR, live re-read first; production applied by the person|failure|·|
|Verify|`live-check` passes after the soak; record: environment, asset, version, digest; close|escalate: the person, row by row; fail: Failure|·|

The delegator applies `designed`, quoting the person. Under a Rollout carrying the person's `designed`, `sdlc-campaign` gives a Release with no one-way step its yes. One-way: no rollback undoes it, such as a destructive migration or a removed API; never a Publish.

## Failure

|When|Then|
|---|---|
|nothing served|rest; Plan again|
|anything served|⛔ roll back or fix forward, both prepared; nothing deployed: fix forward|
|rolled back|**not planned**|
|fixed forward|Plan again, a new yes|
|failing verdict accepted|**completed** + `deviated`|
