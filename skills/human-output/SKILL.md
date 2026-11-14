---
name: human-output
description: Shape what a person reads so they see its state at a glance and answer by number. Trigger before reporting status, proposing work or edits, laying out options, or summarizing for a person, before writing an issue or pull request body, and whenever the user asks for an outline, a table, a key, icons, an "austere" or "brutish" form, "terms and phrases", "at a glance", or a "human version", or calls a reply a wall of text.
---

**A person reads the shape before the words.** Layout, icons, and order carry the state; words go only where the shape cannot. The test: the person sees the state at a glance and answers by number. A link's text is the bare number.

## The form

- **Outline**: the default.
- **Table**: like items compared on the same few attributes.
- **Prose**: when the person asks to discuss. State the problem plainly and wait.

Two subjects get an outline each.

## The outline

```
Shortcuts are two tasks from done; one waits on you.
✅ done · 🟢 ready for you · ⛔ waits on you · ⬜ next · ⏸️ parked

Your queue
- ⛔ #41 approve binding renames → unblocks #43
- 🟢 #52 merge print view

**Shortcuts**
- ✅ #40 keymap v2
  - ⛔ #41 binding renames · list drafted
  - ⬜ #43 import old keymaps · after #41
**Printing**
- 🟢 #52 print view · checks green
  - ⏸️ #55 page headers · after launch
```

1. **Outcome**, one line.
2. **Key**, one line: four to seven colored emoji, distinct in shape as well as color, each meaning one to four words. A symbol keeps its meaning for the whole conversation.
3. **Your queue**, when anything waits on the person: their acts only, in the order of what each unblocks.
4. **The tree**, nested as the real hierarchy nests.
5. **Questions**, at most three, each answerable cold: the quoted span, the stakes, a recommendation, and the default taken on silence.

Each line is one item: status icon, number, then terms and phrases. The number is its issue's, else an outline number (`1`, `1.1`). An item of mixed kind leads with two icons, kind then status (📄 issue · 🔀 pull request). A proposal shares one tree with what exists, told apart by icon (🆕 create · 📌 exists · ✏️ edit · ⏸️ parked), each edit inline on the line it changes; what already holds and what is left out get a group each.

## Terse, not private

Austere keeps the person's own words: a term they already use, or one defined where it first appears. A line whose item carries a surprise (its size, its cost, anything irreversible) states it. The outline reports the state of the product, what is done and what is not, and leaves the running of the work out of it.

## The table

- Two text columns at most, title and summary; every other column holds a single icon. A cell holds an icon or text; one that wants both means the columns need re-cutting.
- Rows numbered, groups as bold header rows inside the one table, a tally line beneath.
- `·` marks "does not apply", distinct from a blank.
- A set of decisions is a table: option, recommendation, default on silence.
- A new key for a large table is proposed, self-critiqued, and agreed with the person before the table is filled.

## The human version

An issue or pull request body opens with a human version above the detail an agent works from: `### Human version` in an issue, `## Human version` in a pull request. Three to seven bullets, one fact each, fragments joined by `→`, `=`, `·`, or `:`. Its slots, as they apply: what changes, `Done =`, `Blocked by #N` and `Blocks #N`, `Not doing:`, `Risk:`, and on a pull request `Live:` with the proof. It is plain text and states claims; icons stay in conversation, and reasons go to the detail below. Drafts go to the person in conversation before posting.

```
### Human version
- Print → any page, without the sidebar.
- Done = a page prints as it reads on screen.
- Blocked by #41 · Blocks #57
- Not doing: page headers (#55)
- Risk: wide tables clip at the margin
```

## Cadence

Speak when something changed. A status outline goes out when the person asks for one, or when nothing can proceed without them, and keeps its shape from one to the next.
