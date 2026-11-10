---
name: dev-ui
description: How to build and ship a web UI as its own image — the path prefix it shares with the proxy, a static build behind Caddy, the build as the content gate, interactivity only where a page asks, and what a UI shares with a sibling UI. Trigger when scaffolding, reviewing, or changing a front-end repository's build config, base path, Dockerfile, web server config, or styling foundation, when deciding how two UIs share tokens or components, or when aligning a surface to a design system.
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

## Aligning a surface to a design system

Set `R` to the base ref, `S` to the surface's path, `P` to the regex of hardcoded palette utilities (`(text|bg|border)-(gray|slate|…)-\d{2,3}`), and `C` to the design system's class prefix.

- **Baseline from the base ref, never from a number written down**: re-run these before planning.

```bash
git grep -hPo "$P" $R -- "$S" | sort | uniq -c | sort -rn   # hardcoded palette, by frequency
git grep -lPo "$P" $R -- "$S" | wc -l                       # and by file count
git grep -lP "\b$C" $R -- "$S"                             # design-system classes already in use
git ls-tree -r --name-only $R | grep "$S"                   # the surface itself
```

- **`git grep -E` ignores `\b`**: it returns zero hits that read as a clean result. Use `-P`.
- **Enumerate routes from the router**, not the navigation; a page linked from nowhere is still on the surface.
- **Review each page on three axes**, against the design system and the product's canonical copy, reading the code and the render, since each shows defects the other hides:
  - **Style**: palette, type, spacing, components, light and dark, desktop and 375px.
  - **Messaging**: copy that contradicts the canon, is placeholder, or is stale.
  - **Nav**: can a user arrive, return, and see chrome matching its neighbours.
- **Look for these defects**:
  - Parallel chrome: two nav or footer systems, chosen by layout route.
  - Asset drift: one logo drawn from a component here and a raster there.
  - A theme that does not carry across pages: its storage key scoped per surface.
  - A hardcoded palette that no theme can move.
  - Placeholder in production copy, such as `(insert link)`.
  - A dead error branch matching a string the API never returns.
  - A `<label>` without `htmlFor`, an `<input>` without `id`.
  - Content gated on visibility as the first thing on screen, so the page opens blank.
  - A split layout putting a screen of prose above a mobile form.
  - A relative `href` that resolves only from the current path.
  - A nav link to the page you are on.
  - An orphan route, reachable only by URL.
  - Validation shown three ways across forms.
- **Confirm which tree the dev server serves** before trusting a result: fetch a module only the branch has and one only the base has; exactly one returns JavaScript, the other the SPA fallback. A shell's directory can revert between commands.
- **Verify styling by computed value**: `getComputedStyle` on a representative element; screenshots break when the page is scrolled programmatically.
- **Audit chrome parity by walking the routes** with `pushState`, asserting the system's root, nav and footer are present and the old ones absent.
- **Check a dormant page behind a guard** by lifting the guard, then restoring it and grep-confirming the restore.
- **The gate sees structure, never appearance**; CI may not run the tests, so run them locally and look at the render.
