---
name: walkthrough
description: Read code with a person one block at a time, so they understand it before they approve, reorganize, or delete it. Trigger when the user asks to understand, explain, or walk through a file, package, or pull request.
---

**A walkthrough teaches; nothing changes unless the person asks.**

## Pace

One chunk at a time: a logical block, a type, a function, a resource, ten to thirty lines. After each, stop and take direction: continue, deeper, skip, or a question. Deeper means data flow, concurrency, error paths, and how the chunk joins the next; skip means one line and on. Line by line only on a block the person names, after a chunk pass left it unclear.

## Order

Dependency order, bottom up:

1. types and constants
2. pure helpers
3. I/O and integrations
4. orchestration and wiring
5. tests, as what behavior they prove
6. deploy wiring, as what runtime it enables

A pull request is walked the same way over its diff.

## Each chunk

Cite it by path and lines, then say:

- what it does, in plain language;
- what breaks without it, concretely, or that nothing does and it should go;
- the simpler shape considered, or that none is.

Name where it sits, which layer or boundary, and whether it is standard use of a library or framework or this project's own choice. Expand an acronym the first time.
