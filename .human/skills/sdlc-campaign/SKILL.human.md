> One long-lived agent carries a Rollout, Releases with time and conditions between them, from plan to end state live: an [`sdlc-ship`](../sdlc-ship/SKILL.human.md) per Release, weeks mostly waiting. One Release needing neither is no Rollout.

Fires: planning, running, waking, resuming or closing a Rollout.

Stages run [the hub protocol](../sdlc/SKILL.human.md#stages), commenting on the Rollout. Its state stays there, so a replacement resumes: the plan in the body, one status comment edited in place, the stage comments as the decision log.

|Stage|Must hold|⛔|🛑|
|---|---|---|---|
|Precheck|Rollout open, fields filled, assigned|·|closed|
|Plan|Releases a graph, each blocked by exactly the Release or gate Task it needs; a phase per row: purpose, live conditions, wait, deadline, back-out, one-way; one-way few and late; cleanup last; gates sized to Exposure, `launch-review` and security audit before going public; filed once `designed`|the plan, until the person applies `designed`; one phase is a Release|·|
|Change|live reads first, independent ones together; an `sdlc-ship` per Release, `parallelize`d within a phase; a reversible Release's yes is the Rollout's `designed`; a one-way one, whose plan names a one-way step, needs the person's, given `plan-check`'s verdict on its conditions; each Release accepted on live digests|what a Release escalates; a plan unmatched to its phase|carrying a gate Task: it authors no code|
|Verify|every wake: earlier phases still live, gates read live from the apply time once propagated, status updated, next wake set; a regression backs out at once|deadline, stall (past the wait, no gate newly met), unreadable check, changed world|·|
|Close|every Release accepted; cleanup holds; 3C record|always: the person accepts|·|

Failure: back-outs in reverse phase order before the first one-way phase; fix forward after.

Its runtime wakes it on timers and events, watches for a stale status comment, and reads production.
