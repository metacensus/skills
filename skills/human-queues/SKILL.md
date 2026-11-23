---
name: human-queues
description: Route everything a run needs from its person into two side sessions opened at kickoff, one for the commands only their hands run and one for the decisions only they make, so the run's own session stays for steering. Trigger when a person delegates a run of agents that will need their hands or their judgment, as an sdlc-crew or sdlc-fleet does, when a person asks for their queue, and when a prompt names human-queues beside another skill.
---

**The person acts in their queues; in the run's session they steer, halt, or ask for status.**

## Kickoff

Before any other work, the carrier the person delegates to starts two [`human-steps`](../human-steps/SKILL.md) side sessions, each from a [handoff](../sdlc/SKILL.md#handoff), fresh context, no worktree:

| Queue | Runs | Takes | Records on the item's issue |
|---|---|---|---|
| Commands | [Commands](../human-steps/SKILL.md#commands) | a step only the person's hands run: a credential, a shared or irreversible change, a refusal | one line once its output checks |
| Decisions | [Questions](../human-steps/SKILL.md#questions) | a choice waiting on the person: a remit's [stops](../sdlc/SKILL.md#roles), a merge the remit keeps, asked as a yes | `Decision:` or `Deferred:` |

Each handoff's Grants are recording on issues; its Stop is the person saying stop. An empty queue says so and waits for the next item.

## Routing

- One carrier owns the queues; a carrier beneath it escalates to it, and it routes.
- Each item goes to its queue as it arises, its issue linked and enough beside it to act on without the run's context: the quoted span, the record, why it matters.
- Nothing for the person goes into the run's session; there they get only [the hub's status outline](../sdlc/SKILL.md#reporting).
- Answers are read from the issues, never from the queue sessions; threads run on meanwhile, as [`sdlc-crew`'s Waiting on a person](../sdlc-crew/SKILL.md#waiting-on-a-person) says.
- Where no side session can start, the carrier runs `human-steps` itself, commands and decisions in turns of their own.
