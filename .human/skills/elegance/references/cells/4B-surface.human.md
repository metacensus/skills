> A module's surface is a promise to every caller: each export is usable from its name and type, or it should not exist.

```
            3B contract
                ↑
4A plan ↔ 4B surface ↔ 4C merges
                ↓
            5B code
```

Neighbours: [3B](3B-contract.human.md) · [4A](4A-plan.human.md) · [4C](4C-merges.human.md) · [5B](5B-code.human.md)

Tier 4 · scope Module · time Current

## Example

One module's exports: its types, its functions, the invariants callers can rely on.

## Location

**Package API**, in the location key (grid).

## Clear when

name + type → a caller uses every export · every stated invariant pinned by type or test · nothing exported that nothing consumes

## Excess

| Excess | Test or move |
|---|---|
| **A doc comment that restates the signature** | `Parse parses` adds nothing. Keep only what the type cannot say (constraint, invariant, rejected alternative), shorter than the signature. |
| **A package doc that explains the files** | One paragraph: what the package is for, where it sits. A file tour copies the directory listing. |
| **A helper exported because it exists** | Every export is a promise. Nothing outside consumes it → unexport; nothing consumes it → delete. |
| **Two helpers or types doing one thing** | A near-duplicate is a missing edge. Keep one; move the other's callers. A struct mirroring another field by field → hold the other. |
| **A wrapper thinner than its name** | Body is one call, comparison, or nil check, and shorter than the name → inline, unless the name carries an invariant the call does not. |
| **A type that wraps one value and holds no invariant** | Keep only if construction enforces a constraint or the compiler must keep two values apart. Else use the plain value, or a named type where it has methods (`http.HandlerFunc`), no constructor. |
| **An option, parameter, or mode with one caller** | Nothing exercises the freedom; no reader → remove. |
| **A README for the module that mirrors the code** | Types and signatures are read where typed; a listing is a second copy that drifts by the next export. |

## Cost

Callers rely on invariants that do not hold · duplicated helpers multiply the fix · every export is a compatibility promise paid on the next change.

## Moves

1. Strengthen before describing → rename · retype · add the test
2. Unexport and delete before documenting
3. The surface cannot carry it → state the invariant once where callers read it, shorter than the signature
4. A dependency or seam decision → record it once at the seam, with the cost it avoided (theory §2.3)
