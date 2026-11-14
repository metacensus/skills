> A walkthrough teaches; nothing changes unless the person asks.

Fires: asked to understand, explain, or walk through a file, package, or pull request.

```
Chunk → Stop → person's call ─┬ continue → next chunk
                              ├ deeper   → same chunk, more
                              ├ skip     → one line, next chunk
                              └ question → answer, stop again
```

## Pace

One chunk at a time: a block, type, function, or resource, 10 to 30 lines.

| Person says | Then |
|---|---|
| continue | next chunk |
| deeper | data flow · concurrency · error paths · how it joins the next |
| skip | one line, move on |
| a question | answer, stop |

Line by line: only a block the person names, after a chunk pass left it unclear.

## Order

Bottom up, by dependency:

1. types and constants
2. pure helpers
3. I/O and integrations
4. orchestration and wiring
5. tests, as what behavior they prove
6. deploy wiring, as what runtime it enables

A pull request: same order over its diff.

## Each chunk

Cite path and lines, then:

| Say | Content |
|---|---|
| What it does | plain language |
| What breaks without it | concrete; or nothing breaks, so it should go |
| Simpler shape | the one considered; or none |
| Where it sits | layer or boundary |
| Whose choice | standard library or framework use · this project's own |

Expand an acronym on first use.
