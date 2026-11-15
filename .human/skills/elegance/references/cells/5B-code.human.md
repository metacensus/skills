File, Current, **Code**. ↑[4B](4B-surface.human.md)

**Clear when** A reader confirms what a function does from its name and body, without a comment; build, lint, tests pass. The code needs the comment or it does not.

|Excess|Move|
|---|---|
|**A comment restating its code**|Cover it; nothing lost, delete.|
|**A comment longer than its subject**|Delete; a design smell.|
|**A comment on why the function exists**|Check the call sites.|
|**A shape repeated at every call site**|The signature is wrong: take `x`, wrap inside, derive per-call arguments in the callee. Tests too.|
|**A comment on a scope above the file**|Move it up (theory §3.2).|
|**A number or list a check computes**|The script prints it, or derive it where defined (theory §2.3).|
|**A file header narrating the file**|One or two lines.|
|**Dead paths, branches the types exclude, unset flags**|Delete.|

**Cost** Minutes; a kept comment is maintained forever.

**Moves** Retire the comment; if something is lost, strengthen the artifact (rename, retype, extract, test). Refactor repeated signatures. Rewrite whole. A surviving comment is shorter than the code.
