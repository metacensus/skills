Module, Current, **Package API**. ↓[3B](3B-contract.human.md) ↑[5B](5B-code.human.md)

**Clear when** A caller uses every export from name and type alone, each stated invariant is pinned by type or test, nothing is exported unconsumed.

|Excess|Move|
|---|---|
|**A comment restating the signature**|Keep only what the type cannot say, shorter than it.|
|**A package doc touring files**|One paragraph.|
|**A helper exported because it exists**|Unexport, or delete.|
|**Two helpers or types doing one thing**|Keep one; move callers.|
|**A wrapper thinner than its name**|Inline, unless the name carries an invariant.|
|**A one-value type, no invariant**|Use the plain value, or a named type.|
|**An option with one caller**|Remove.|
|**A module README mirroring the code**|A drifting copy.|

**Cost** Callers trust failing invariants.

**Moves** Strengthen before describing: rename, retype, test. Unexport and delete before documenting. State the rest once, where callers read it. Record seam decisions at the seam (theory §2.3).
