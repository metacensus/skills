Going public publishes every object ever held, so init reads them all and proves it did.

## What is in scope

Every published ref and the blobs, commits, tags, and names they reach, plus the host's issues and pull requests for a repository already public.

## The manifest

A list of every object id in scope, plus one entry for ref names; coverage is proven when every one was read or deliberately skipped.

## Order

A secret scanner, a literal grep for any examples, cheap-model scanners over the leads, binaries listed, licensing, then triage, which groups the real findings with a proposed fix each for the user to decide. A rewrite means running again.

## What the fan-out answers

Batches of about 2,000 lines, independent, each done when it reports every id it held.
