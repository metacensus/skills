---
name: human-output
description: Shape what a person reads so its layout carries the information before its words. Trigger before reporting status, proposing work or edits, laying out options or summarizing for a person; before writing an issue or PR body, or a document read beside one an agent reads; when the user asks for an outline, table, key, icons, an "austere" or "brutish" form, "terms and phrases", "at a glance" or a "human version", or calls a reply a wall of text; and when revising a page with cold reviewers, or asked to wake a page up or critique it for a reader.
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

Keep what the reader needs to act, move detail down a layer, and drop what nobody would miss. A rule rarely survives losing its condition (`when X → Y` is not `Y`); defaults, tests, and examples usually earn their place; reasons are usually the first to go. Every term is one the reader already uses, or one defined where it first appears. An item that carries a surprise (its size, its cost, anything irreversible) says so on its line. A link to a numbered thing takes the number or coordinate as its text.

A list or board item is usually its title alone. A note follows only where the reader needs it to act; the rest goes behind the item's link. Words are literal: no metaphor stands in for what the item is or does. One idea per item, at most about 25 words.

```
⛔ #41 binding renames · pick one of two names
🔶 #43 import old keymaps
```

not `🔶 #43 import old keymaps · the bridge legacy users cross once the dust settles on #41`.

## Marks

A mark keeps one meaning within what the reader sees together. The defaults:

✅ done · ⛔ waits on the reader · 🔷 ready for the reader · 🔶 next · ⏳ waiting · 🌙 deferred · ⭐ new · 🩷 needs a person's hands (deep design, staging, production) · 📌 exists, unchanged · 🟣 edit · ⚠️ risk

Marks are read at a glance, so prefer plain icons that differ in color and shape (circle 🟣, diamond 🔶, hourglass ⏳). Avoid:

- Icons that are mostly grey, white, or black (⬜ ⏸️ 📄): they fade into text.
- Detailed icons: the signal is lost at a glance.
- Look-alikes: text on one background color (🆕), similar hues (two greens, two yellow points), or a family of arrow icons (🔀).

Icons lead the line, never inline or trailing. Up to three stack as categories and tags for the larger thing, then the title, then a rare note: `🔷 🌱 ⚠️ title · note`. Text never repeats what an icon already says.

A key adds marks, each colored and distinct in shape. Between items `·` joins like ones and `→` means "then"; alone in a cell, `·` is a negative or "does not apply", so color marks the exception.

## Media

| Medium | Leads with | Draws | Route |
|---|---|---|---|
| Conversation | the outcome, then the reader's queue | marks, tables | [chat](references/chat.md) |
| Parallel document | a map of the structure or flow | headings, tables, marks | [parallel](references/parallel.md) |
| Issue or pull request body | what changes, and when it is done | tables, task lists, diagrams | [github](references/github.md) |

Where a medium cannot draw a family's form, use the nearest form it can: a loop becomes a numbered list that returns to its first step.

A page read often or by many earns [the loop](references/loop.md): cold agents drafting, critiquing, and ranking it.
