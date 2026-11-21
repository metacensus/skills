> Landing ends when what merged is published and its consumers run it; work blocking an open Release ends at the merge.

Fires: waiting on a run, check, or agent; merging a PR or a stack; a refused merge; a release.

```
Wait → Merge (bottom first, retarget, sync) → Release → Verify → Bump
```

A Release ships once nothing blocking it is open, and closes once its consumers run it.

⚠️ Never `sleep`: wait on a background command that exits on every terminal state, or once stalled past twice the usual length.

| Refused | Then |
|---|---|
| check pending or failing | wait, or fix |
| branch behind | [sync](../checkin/SKILL.human.md#sync) |
| review required | the `reviewer`; never self-approve |
| auto-merge off | merge once green |
| method not allowed | an allowed one |
| rule violated | meet it, or an admin |
| GraphQL limit | REST |
| environment refuses | ⛔ a person, per [`operator-runbook`](../operator-runbook/SKILL.human.md) |
| merged by mistake | revert in a PR, whatever the merge method; ⚠️ never force-push |
