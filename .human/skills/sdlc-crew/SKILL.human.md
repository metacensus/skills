> A delegator carries a `designed` Epic to closed: an author per child, a fresh reviewer per pull request, the plan held by the delegator, who carries no child.

Fires: orchestrating or delegating an Epic's children across agents; asking what the delegator does next.

Stages run [the hub protocol](../sdlc/SKILL.human.md#stages), commenting on the Epic, composing [`parallelize`](../parallelize/SKILL.human.md).

|Stage|Must hold|⛔|🛑|
|---|---|---|---|
|Precheck|Epic `designed`; children `ready`, acyclic; remit cited|a family question|cycle|
|Plan|contracts land first; no write-sets overlap|contract not the delegator's|cannot cut|
|Delegate|a child briefed only when Ready, in its own tree|Design outside remit|an author stops|
|Review|fresh `sdlc-review` per PR|a choice not the delegator's|·|
|Land|per its author's [Land](../sdlc-author/SKILL.human.md#land); a ruling reaches the children it rules on|merge refused|a stop reopens the plan|
|Close|children closed; `Decision:` and rollout record on the Epic; `sdlc-hygiene` clean|dead end or deviation|·|

## Delegate

Author 1 (Precheck, Design) → delegator confirms Design, applies `designed` (within remit, else ⛔) → Author 2 (Implement → Land)

## Close

|Goal|Close as|
|---|---|
|met|**completed**|
|Spike shows it cannot be met|**not planned**|
