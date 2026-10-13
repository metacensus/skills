---
name: rename
description: Rename a symbol, term, or path across a repository by concept rather than by string — find every spelling, group occurrences by what they mean, confirm the map, then apply it. Trigger when the user asks to rename something, and whenever a rename would touch more than one file.
---

**A rename is per concept, not per string.** One string can name two things and two strings one, so find-and-replace renames the wrong set in both directions.

## Anchor

Start from one exact string and the intent behind it: a symbol with its package, a path and line, a quoted literal. Ask for one if the request names none; targets wait for the map.

## Search

Case-sensitive, the whole repository, the anchor exactly. Report the count and the files, grouped by kind, before widening.

## Discover

Read the contexts and collect what names the same concept, confirming each by its own search:

- casings and separators: `UserAccount`, `user_account`, `user-account`, `USER_ACCOUNT`;
- derived terms: plurals, abbreviations, the anchor inside a longer identifier;
- file and directory names.

Then group every occurrence by meaning. Two occurrences are one concept when renaming one must rename the other; the same string in two packages may be two. Doubt is listed as doubt, never guessed.

## The map

One table, one row per concept: its current spellings, the context that tells it apart, its count, and a target, left to the person where the intent does not settle it. A row derived from another, the snake_case of a PascalCase row, says so and follows that row's answer. Rows may converge (two strings, one target), run parallel (two strings, two targets that keep their difference), or diverge (one string, two targets by context).

Flag every name that leaves the repository: images and resource names, endpoints and URLs, tables and columns, environment variables, whatever another system or person depends on. Pause here: the person adjusts rows, drops rows, names what was missed, and confirms.

## Apply

Work a string with two targets one context at a time. Change files, then paths. Report one line per replacement with its count, and the external names the person still changes by hand. A concept found midway goes back to the map.
