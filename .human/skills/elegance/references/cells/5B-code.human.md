The file as it is, with its tests. Clear when a reader can tell what a function does from its name and body, without a comment, and the build, lint, and tests pass.

## Excess

- A comment restating its code, or longer than it.
- A comment justifying why a function exists; that is a smell about the function.
- A shape repeated at every call site, or an argument each caller picks by which call it is; fix the signature, in scope whenever behavior is unchanged.
- A comment explaining a scope above the file.
- Numbers or lists a check could compute, written by hand.
- A file header narrating the file.
- Dead paths and unreachable branches.

## Moves

Delete the comment first. If something is lost, rename, retype, extract, or test until it isn't.
