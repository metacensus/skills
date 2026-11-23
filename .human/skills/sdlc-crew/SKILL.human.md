> A delegator carries an Epic from Design to closed: an author per child, a fresh reviewer per pull request, the plan held by the delegator, who carries no child. Starts from a [handoff](../sdlc/SKILL.human.md#handoff). Under an Initiative, its delegator is [`sdlc-fleet`](../sdlc-fleet/SKILL.human.md), the Initiative's Decided and Stops binding it.

Fires: orchestrating or delegating an Epic's children across agents; designing an Epic's children; asking what the delegator does next.

Stages run [the hub protocol](../sdlc/SKILL.human.md#stages), commenting on the Epic, composing [`parallelize`](../parallelize/SKILL.human.md).

## Waiting on a person

> A choice waits on a person, never the work around it.

|Question|Then|
|---|---|
|one of the remit's [stops](../sdlc/SKILL.human.md#roles)|⛔ to the person|
|any other|`Decided, reversible:`, keep going|

While it waits, only what can be undone: build the options · stack on PRs in review · push the neighbours · run discovery.

What waits on the person goes through [`human-queues`](../human-queues/SKILL.human.md), opened at kickoff by the carrier the person delegates to.

Away, from a handoff: grants quoted in every brief · a clock-time stop · a status outline on return.

|Stage|Must hold|⛔|🛑|
|---|---|---|---|
|Precheck|Epic open, `ready`; remit and stops cited; `design-check` run|not framed, its delegator's; a fix not the delegator's, a `design-check` question Design skips|Epic closed|
|Design|plan proposed: children, non-goals, contracts; children filed once `designed`|until `designed`|fails its bar|
|Plan|children acyclic; the Epic blocks its Publish, or its Tasks do; contracts land first; no write-sets overlap|contract not the delegator's|cycle; cannot cut|
|Delegate|each child framed, briefed only when Ready or stacked, in its own tree, accepted once closed|Design settles a stop|an author stops|
|Review|fresh `sdlc-review` per PR; once children close, `delivery-review` over the Epic|a choice not the delegator's|·|
|Land|per its author's [Land](../sdlc-author/SKILL.human.md#land); a ruling reaches the children it rules on|merge refused|a stop reopens the plan|
|Close|children closed; `Decision:` and rollout record, with each Accept, on the Epic; `sdlc-hygiene` clean; then to its delegator for Accept|dead end or deviation|·|

## Delegate

Author 1 (Precheck, Design) → delegator confirms Design, applies `designed` (⛔ on a stop) → Author 2 (Implement → Land)

## Close

|Goal|Close as|
|---|---|
|met|**completed**|
|Spike shows it cannot be met|**not planned**|
