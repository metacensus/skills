How to build and ship a web UI as its own image, on top of `dev-ci-github`.

## One path, agreed three times

Build base, served directory, and proxy route share one prefix that nothing strips; the image test requires the base page and a hashed asset, and links come from the base value.

## A static build, served small

Static files built once and served by Caddy behind the edge, immutable hashed assets, real 404s, a healthcheck on the base page.

## The build is the gate

Content schema, imports, and types fail the build, which excludes drafts.

## Interactive only where a page asks

Components hydrate where marked and when visible, and reach the API same-origin through the proxy.

## Sharing with a sibling UI

Same framework majors, no shared package before a second consumer, and any copy names its source and has an issue to replace it with a dependency.
