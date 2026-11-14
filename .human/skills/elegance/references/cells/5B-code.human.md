> Code is where excess is most measurable: the code needs the comment, or it does not.

```
            4B surface
                ↑
5A criteria ↔ 5B code ↔ 5C commit
```

Tier 5 · scope File · time Current

## Example

The file as it is · the test that passes or fails against it.

## Location

**Code**, in the location key (grid).

## Clear when

name + a glance at the body → what the function does, no comment · build · lint · tests pass

The gate is the strongest rung in the graph.

## Excess

The tangible form of every excess above it.

| Excess | Test or move |
|---|---|
| **A comment restating its code** | Cover it and read the function; nothing lost → delete. A thirty-line function with a good name needs none. |
| **A comment longer than what it describes** | Delete it, or find what truly needed explaining; that is a design smell. |
| **A comment explaining why the function exists** | Look at the call sites: self-documenting → comment goes; otherwise the function should not exist in this shape. |
| **A shape repeated at every call site** | The signature is wrong, not the callers. Helper takes `x`; the common wrap moves inside; an argument each caller picks by call kind is derived in the callee. Tests are call sites. In scope when observable behavior is unchanged. |
| **A comment explaining a scope above the file** | Move it up (theory §3.2). |
| **A number or list a check computes, transcribed beside it** | The script prints it, or the set is derived where defined so adding to it registers it (theory §2.3). |
| **A file header narrating the file** | One or two lines for a reader choosing whether to open it; nothing more. |
| **Dead paths, defensive branches for states the types exclude, flags nothing sets** | No reader → delete. |

## Cost

Minutes to fix · debt in volume for the tier above. A kept comment is maintained by every later editor.

## Moves

1. Retire the comment → if something is lost, strengthen the artifact: rename · retype · extract · assert · test
2. Call sites repeat a shape → refactor the signature
3. Explains a higher scope → move it upward
4. Rewrite whole, so nothing describes what was replaced (theory §4.3)
5. A comment survives → shorter than the code; the change that added it says why
