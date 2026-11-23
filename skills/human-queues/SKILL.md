---
name: human-queues
description: Route what a delegated run needs from its person into two human-steps side sessions opened at kickoff, one for the commands only their hands run and one for the decisions only they make. Trigger when a person delegates a run of agents, as an sdlc-crew or sdlc-fleet does, and when they ask for their queue.
---

**The person acts in their queues; the run's session is for steering and [the status outline](../sdlc/SKILL.md#reporting).**

## Kickoff

Before any other work, the carrier the person delegates to starts two [`human-steps`](../human-steps/SKILL.md) side sessions, each from a [handoff](../sdlc/references/handoff.md), fresh context, no worktree; each handoff grants recording on issues, and its Stop is the person saying stop.

| Queue | Kind | Takes |
|---|---|---|
| Commands | [Commands](../human-steps/SKILL.md#commands) | the steps [`human-steps` makes the person's](../human-steps/SKILL.md#whose-step) |
| Decisions | [Questions](../human-steps/SKILL.md#questions) | a remit's [stops](../sdlc/SKILL.md#roles); a merge the remit keeps, asked as a yes |

Where no side session can start, the carrier runs `human-steps` itself, commands and decisions in turns of their own.

## Routing

- One carrier owns the queues; a carrier beneath it escalates to it, and it routes.
- Each item goes to its queue as it arises, its issue linked and enough beside it to act on without the run's context: the quoted span, the record, why it matters.
- A deferred question returns to the Decisions queue, sent by the owning carrier, when it alone holds all work.
- Answers are read from the issues, never from the queue sessions; threads run on meanwhile, as [`sdlc-crew`'s Waiting on a person](../sdlc-crew/references/waiting.md) says.
