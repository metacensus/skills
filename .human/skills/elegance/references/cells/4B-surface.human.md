One module's exports and the invariants callers rely on. Clear when every export is usable from its name and type, and every invariant is pinned by a type or test.

## Excess

- A doc comment restating the signature; one that stays says what the type cannot.
- A package doc touring its files.
- Exports nothing consumes, and duplicate helpers or mirrored types; every export is a promise to every caller.
- A one-field struct holding no invariant: the plain value, or a named type of it when it has methods.
- A wrapper thinner than its name.
- An option with one caller.
- A module readme mirroring the code.

## Moves

Rename, retype, or test before describing. Unexport and delete before documenting.
