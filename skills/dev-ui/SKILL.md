---
name: dev-ui
description: How to build and ship a web UI as its own image — the path prefix it shares with the proxy, a static build behind Caddy, the build as the content gate, interactivity only where a page asks, and what a UI shares with a sibling UI. Trigger when scaffolding, reviewing, or changing a front-end repository's build config, base path, Dockerfile, web server config, or styling foundation, or when deciding how two UIs share tokens or components.
---

CI and release follow [`dev-ci-github`](../dev-ci-github/SKILL.md).

## One path, agreed three times

A UI under a prefix holds it in the build's base (`base: '/app'`), the directory the image serves (`/srv/app` under a `/srv` root), and the proxy route (`/app/*`). Nothing strips it, so a URL means the same thing at every hop.

- **The artifact test holds it**: run the image, then require 200 from the base page and from one hashed asset that page links.
- **Every internal link is built from the framework's base value**, never a literal; check whether it ends in a slash before appending.

## A static build, served small

- **Render to files**; a server runtime is added only for something a file cannot answer.
- **The image builds the site once on `$BUILDPLATFORM`** and takes its architectures from the runtime image.
- **Caddy's `file_server`** with `admin off` and `auto_https off`; the edge terminates TLS.
- **Hashed assets** are `Cache-Control: public, max-age=31536000, immutable`; HTML is not.
- **An unknown path is a 404** with the site's own page (`handle_errors` → `rewrite` → `file_server` keeps the status), never the index with a 200.
- **The image healthcheck** fetches the base page with the image's BusyBox `wget`.

## The build is the gate

The build checks content frontmatter against a schema, imports, and types (`astro check`, `tsc --noEmit`), and excludes drafts.

## Interactive only where a page asks

A component hydrates only where a page marks it, on visibility (`client:visible`) rather than load, and reaches the API same-origin through the proxy.

## Sharing with a sibling UI

- **Match framework majors** (React, Tailwind) so a component can move between them.
- **No shared package until a second consumer exists.**
- **A copy names its source file**, and an issue tracks replacing it with a dependency on a published, versioned package.
