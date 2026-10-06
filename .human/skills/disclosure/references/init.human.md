Going public publishes every object ever held, so init reads them all and proves it did.

## What is in scope

Every published ref and the blobs, commits, tags, and names they reach, plus the host's issues and pull requests for a repository already public.

## The manifest

A list of every object id in scope; coverage is proven when every one was read or deliberately skipped.

## Order

A secret scanner, literal grep, cheap-model scanners for variants, binaries listed for the user, licensing, then triage. A rewrite means running again.

## What the fan-out answers

Batches of about 2,000 lines, independent, each done when it reports every id it held.
