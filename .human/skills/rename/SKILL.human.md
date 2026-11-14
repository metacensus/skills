> A rename is per concept, not per string.

Fires: a rename; any rename across files.

```
Anchor → Search → Discover → The map → ⛔ Confirm → Apply
```

## Anchor

| Kind | Example |
|---|---|
| symbol | name plus its package |
| path | path and line |
| literal | a quoted string |

No anchor → ask. Targets wait for the map.

## Search

```
case-sensitive · whole repo · anchor exactly → report count and files, by kind, before widening
```

## Discover

| Look for | Example |
|---|---|
| casings, separators | `UserAccount`, `user_account`, `user-account`, `USER_ACCOUNT` |
| derived terms | plurals, abbreviations, anchor inside a longer identifier |
| file and directory names | |

Confirm each by search; group by meaning:

```
when renaming one must rename the other → one concept
same string in two packages            → maybe two
doubt                                  → listed as doubt
```

## The map

One row per concept: spellings, context, count, target.

| Shape | Strings → targets |
|---|---|
| converge | two → one |
| parallel | two → two, difference kept |
| diverge | one → two, by context |

A derived row says so and follows its source row.

⚠️ Flag names that leave the repo: images, resources, endpoints, URLs, tables, columns, env vars.

⛔ Pause: the person adjusts, drops, adds rows, confirms.

## Apply

| Step | Detail |
|---|---|
| 1 | a string with two targets: one context at a time |
| 2 | files, then paths |
| 3 | report a line per replacement with its count |
| 4 | ⚠️ list the external names the person still changes by hand |

A concept found midway → back to the map.
