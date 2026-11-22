> A delegator carries an Epic from Design to closed: an author per child, a fresh reviewer per pull request, the plan held by the delegator, who carries no child. Starts from a [handoff](../sdlc/SKILL.human.md#handoff). Under an Initiative, its delegator is [`sdlc-fleet`](../sdlc-fleet/SKILL.human.md), the Initiative's Decided and Stops binding it.

Fires: orchestrating or delegating an Epic's children across agents; designing an Epic's children; asking what the delegator does next.

Stages run [the hub protocol](../sdlc/SKILL.human.md#stages), commenting on the Epic, composing [`parallelize`](../parallelize/SKILL.human.md).

A thread waiting on a person, or the person away: [`decouple`](../decouple/SKILL.human.md).

|Stage|Must hold|⛔|🛑|
|---|---|---|---|
|Precheck|Epic open; remit and stops cited; family read|a fix not the delegator's, a family question Design skips|Epic closed|
|Design|plan proposed: children, non-goals, contracts; children filed once `designed`|until `designed`|fails its bar|
|Plan|children `ready`, acyclic; contracts land first; no write-sets overlap|contract not the delegator's|cycle; cannot cut|
|Delegate|a child briefed only when Ready or stacked, in its own tree|Design settles a stop|an author stops|
|Review|fresh `sdlc-review` per PR|a choice not the delegator's|·|
|Land|per its author's [Land](../sdlc-author/SKILL.human.md#land); a ruling reaches the children it rules on; each child accepted on main|merge refused|a stop reopens the plan|
|Close|children closed; `Decision:` and rollout record, with each Accept, on the Epic; `sdlc-hygiene` clean|dead end or deviation|·|

## Delegate

Author 1 (Precheck, Design) → delegator confirms Design, applies `designed` (⛔ on a stop) → Author 2 (Implement → Land)

## Close

|Goal|Close as|
|---|---|
|met|**completed**|
|Spike shows it cannot be met|**not planned**|
