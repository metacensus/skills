---
name: skill-scout
description: Search a person's recent sessions, memory and skills for candidate new skills and edits to existing ones — repeated workflows, rare-but-recurring work, repeated corrections, friction, and where a skill was silent or wrong — through cheap parallel scouts, returned as directions with evidence, not designs. Trigger when the user asks what skills to write next, what a skill is missing, where agents keep needing correction, or to mine sessions or transcripts for skills.
---

**A skill is written from evidence, not from memory of it.** Sessions hold what the person did by hand, said twice, and corrected; nobody rereads them. Cheap [`skill-scout-scan`](../../agents/skill-scout-scan.md) scouts flag whatever a class reaches without weighing it, and the orchestrator weighs, so a candidate is a direction backed by references, never a design.

## Sources

- **Sessions**: main-session transcripts in the window the person names, else the last 14 days, across every project: `find ~/.claude/projects -maxdepth 2 -name '*.jsonl' -mtime -14`, its depth leaving out subagents' transcripts, which hold none of the person's corrections. A worktree's folder folds into its repository's, `sed 's/--claude-worktrees-.*//'`.
- **Memory**: each project folder's `memory/`, each repository's `CLAUDE.md`, and the user-level `~/.claude/CLAUDE.md`.
- **Skills**: the index this session lists, written to scratch as `skills`, a name, a tab and its description per line.

## Batches

Each transcript is reduced to its conversation, tool output dropped:

```sh
jq -r 'select((.type == "user" or .type == "assistant") and (.isMeta | not)) | .type as $who | .message.content
  | if type == "string" then [{type: "text", text: .}] else . end | .[]
  | if .type == "text" and (.text | test("^<(system-reminder|task-notification)>") | not) then "\($who): \(.text)"
    elif .type == "tool_use" then "tool: \([.name, .input.skill // empty] | join(" "))"
    else empty end' SESSION.jsonl
```

A batch file in scratch holds sections headed `=== <id> session|memory <path>`, an id being a session's start date and the first eight characters of its file name, or a memory file's name. One batch is one repository's memory, then its sessions in time order, about 2,000 lines, so one scout reads it whole; a longer session is a batch alone, and the user-level files join the first.

## Fan-out

The [`parallelize`](../parallelize/SKILL.md#what-the-work-answers) questions, answered:

- **Units**: the batches.
- **Edges**: none; `skills` is the contract every scout reads, pinned before the fan-out.
- **Action**: one `skill-scout-scan` per batch, given the batch and `skills`.
- **Done**: every id its batch holds is on its `read:` list.
- **Checks**: none per unit; the merge is the check.

## Merge

- Flags group by target and direction into candidates.
- Recurrence is derived from the refs, never judged by a scout: many is repeated work, a few on separate days is rare-but-recurring.
- A target's body is read before a candidate calls it silent or wrong.

## Report

One [outline](../human-output/references/chat.md#the-outline), a line per candidate: new or an edit; its target, the skill it augments, replaces or sits beside, or `none`; a direction in one sentence; its refs. The person picks, and each pick goes to [`sdlc-capture`](../sdlc-capture/SKILL.md). Evidence stays local: a filed candidate carries its target and direction alone, never a ref or a span.
