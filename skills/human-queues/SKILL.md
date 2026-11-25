---
name: human-queues
description: Hold what a delegated run needs from its person in one queue, in the one session the person talks to, ordered by what each item unblocks and shown one at a time. Trigger when a person delegates a run of agents, as an sdlc-crew or sdlc-fleet does, when a step needs the person's hands, grant or decision, and when they ask for their queue.
---

**One queue, in one session: the one the person talks to.** That session is the delegator itself, or a parent whose child runs the orchestration. No other session holds a queue.

## Grants

A grant the person gives in that session reaches only that session: it does not pass through a sub-session down to its children. A step needing the person's grant runs in the queue's session, or by the person's hands as a [`human-steps`](../human-steps/SKILL.md) command; a child that meets one returns it to the queue.

## The queue

- Each item is a command only the person's hands run, a step needing their grant, or a decision: a remit's [stop](../sdlc/SKILL.md#roles), or a merge the remit keeps, asked as a yes.
- Each is held on its issue, as [`sdlc-crew`'s Waiting on a person](../sdlc-crew/references/waiting.md) says, with enough beside it to act on without the run's context: the quoted span, the record, why it matters.
- The queue is ordered by priority, what each item unblocks, and kept organized as items arrive; it is never split by kind.
- It is shown one item at a time, through [`human-steps`](../human-steps/SKILL.md), each checked before the next.
- Answers are read from the issues; threads run on meanwhile.
