> A ship carries one Release: its Publishes, then its deploys, in one go, checked cold before and after. Hours; it rests only before a Publish, between Publishes and deploys, or after Verify. Started by `sdlc-campaign` or a person: its delegator, who accepts it.

Fires: shipping, deploying or launching to production; a Release ready to go out.

```
Plan → ⛔ yes → Change → Verify
```

|Stage|Holds|⛔|🛑|
|---|---|---|---|
|Plan|work merged; Publish order; each commit, range = scope, version, breaking changes; deploys, non-production first, one one-way step at most, last; rollback target from live; every state safe; `plan-check` passes|until a person's yes, `designed`|needs a Rollout|
|Change|a cut per Publish, downstream once upstream is served; then each deploy as a PR, live re-read first; production applied by the person|failure|·|
|Verify|`live-check` passes; record: environment, asset, version, digest; close|failure|·|

Under an approved Rollout, only a Release with a one-way step needs its own yes.

## Failure

|When|Then|
|---|---|
|nothing served|rest; Plan again|
|anything served|⛔ roll back or fix forward, both prepared|
|rolled back|**not planned**|
|fixed forward|Plan again, a new yes|
|failing verdict accepted|**completed** + `deviated`|
