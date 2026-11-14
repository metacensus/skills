---
name: human-output
description: Shape what a person reads so its layout carries the information before its words do. Trigger before reporting status, proposing work or edits, laying out options, or summarizing for a person; before writing an issue or pull request body, or a document a person reads beside one an agent reads; and whenever the user asks for an outline, a table, a key, icons, an "austere" or "brutish" form, "terms and phrases", "at a glance", or a "human version", or calls a reply a wall of text.
---

**A person sees the shape before reading the words.**

## Families

| Family | Members | Device | Form |
|---|---|---|---|
| Status | state, change, ask | mark | a mark leading its line, under a key |
| Structure | hierarchy, comparison, coverage | position | tree, table, matrix |
| Flow | sequence, lifecycle, cycle | direction | `A → B → C`; a state line with its side exits; a loop |
| Logic | rule, decision | branch | `when X → Y`; a decision table |
| Meaning | definition, example, reason | words | a term table, a sample, short prose |

Classify each piece of what is to be said, give it its family's form, and carry it on the highest device it fits: mark, position, direction, branch, then words.

## What survives compression

Keep what the reader needs to act, move detail down a layer, and drop what nobody would miss. A rule rarely survives losing its condition (`when X → Y` is not `Y`); defaults, tests, and examples usually earn their place; reasons are usually the first to go. Every term is one the reader already uses, or one defined where it first appears. An item that carries a surprise (its size, its cost, anything irreversible) says so on its line. One idea per line, at most about 25 words. A link's text is the number or coordinate it names.

## Marks

A mark keeps one meaning within what the reader sees together. The defaults:

✅ done · ⛔ waits on the reader · 🟢 ready for the reader · ⬜ next · ⏸️ parked · 🆕 new · 📌 exists, unchanged · ✏️ edit · ⚠️ risk

A key adds marks, each colored and distinct in shape. Between items `·` joins like ones and `→` means "then"; alone in a cell, `·` is a negative or "does not apply", so color marks the exception.

## Media

| Medium | Leads with | Draws | Route |
|---|---|---|---|
| Conversation | the outcome, then the reader's queue | marks, tables | [chat](references/chat.md) |
| Parallel document | a map of the structure or flow | headings, tables, marks | [parallel](references/parallel.md) |
| Issue or pull request body | what changes, and when it is done | tables, task lists, diagrams | [github](references/github.md) |

Where a medium cannot draw a family's form, use the nearest form it can: a loop becomes a numbered list that returns to its first step.
