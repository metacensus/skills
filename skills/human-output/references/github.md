# GitHub bodies

An issue or pull request body, read by the team in lists, notifications, and the page itself, and shown to the person in conversation before it posts.

## The human version

The body opens with a human version above the detail an agent works from: `### Human version` in an issue, `## Human version` in a pull request. Three to seven bullets, one fact each, fragments joined by `→`, `=`, `·`, or `:`. Its slots, as they apply: what changes, `Done =`, `Blocked by #N` and `Blocks #N`, `Not doing:`, `Risk:`, and on a pull request `Live:` with the proof. It is plain text without marks and states claims; reasons go to the detail below.

```
### Human version
- Any page prints without the sidebar.
- Done = a page prints as it reads on screen.
- Blocked by #41 · Blocks #57
- Not doing: page headers (#55)
- Risk: wide tables clip at the margin
```
