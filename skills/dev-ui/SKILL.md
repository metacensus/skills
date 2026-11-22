---
name: dev-ui
description: What every web UI shares, and which child skill holds the rest — one image for every environment, one base path, caching and headers, tokens from one source, one version line, generated clients only, and the build as the gate. Trigger when scaffolding, reviewing, or changing a front-end repository's build config, base path, Dockerfile, web server config, styling foundation, dependencies, or API calls, when deciding how two UIs share tokens or components, when aligning a surface to a design system, and before any work that reaches for `dev-ui-astro`, `dev-ui-react` or `dev-ui-testing`.
---

| Skill | Holds |
|---|---|
| `dev-ui` | What every web UI shares |
| [`dev-ui-astro`](../dev-ui-astro/SKILL.md) | Static sites |
| [`dev-ui-react`](../dev-ui-react/SKILL.md) | React apps, and plugins into a host |
| [`dev-ui-testing`](../dev-ui-testing/SKILL.md) | How a UI is tested |
| [`dev-ci-github`](../dev-ci-github/SKILL.md) | CI and release |

## One image, every environment

- **Render to files**; a server runtime is added only for what a file cannot answer, since a file needs no process kept alive or patched.
- **Caddy's `file_server`** with `admin off` and `auto_https off`: the edge terminates TLS, and nothing in the image takes configuration at runtime.
- **One image is promoted through every environment**, so what was tested is what ships. The API is reached same-origin through the proxy and never baked into the build, which leaves nothing to rebuild per environment and no CORS to configure.
- **The image builds once on `$BUILDPLATFORM`** and takes its architectures from the runtime image, since the output is architecture-independent and an emulated build is slow and can crash.
- **Base images are pinned by digest**, so a rebuild cannot pull a different server. **The server runs as a non-root user on an unprivileged port**, so a compromise holds no root.
- **CI smoke-tests the built image, never the dev server**, since the image is what ships; the probes are in [`dev-ui-testing`](../dev-ui-testing/SKILL.md).

## One base path

A UI under a prefix states it once, as `ARG BASE` in the Dockerfile, the one file every hop already reads; a prefix written by hand in each place drifts.

- **The build's base reads it from the environment**, and the image serves `/srv${BASE}`.
- **It is re-exported as `ENV BASE`** for the healthcheck, which fetches the base page with the image's BusyBox `wget`, and for the Caddyfile's `{$BASE}`.
- **The edge proxy's route is the one copy outside the repository**, since the proxy is configured where its other routes are.
- **Nothing strips the prefix**, so a URL means the same thing at every hop.
- **Every internal link is built from the framework's base value**, never a literal, so a moved prefix moves every link; check whether it ends in a slash before appending.

## Caching and headers

- **Hashed assets are `Cache-Control: public, max-age=31536000, immutable`**, with no HTML fallback under their directory, so a missing chunk is a loud 404 rather than HTML parsed as script.
- **The HTML shell and any single-page fallback are `no-cache`**, so after a deploy no browser asks for chunks that are gone.
- **A static site's unknown path is a 404** with its own page (`handle_errors` → `rewrite` → `file_server` keeps the status), never the index with a 200, so crawlers and link checkers see it missing.
- **Every surface sends security headers**: a content security policy naming `script-src` and `frame-ancestors`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy` and HSTS. The image sends them, not the edge, since one image serves every host; a logged-in app needs them most.
- **`robots.txt` is answered per host in the Caddyfile**: production allows, every other host disallows, so one image runs everywhere and no non-production host is indexed.

## Tokens from one source

- **The design-system package maps its palette to semantic roles, and components read roles only**, so dark mode and a rebrand touch one file.
- **Dark mode comes from `color-scheme: light dark` and `light-dark()`**, a `.dark` or `.light` class overriding any subtree, and a pre-paint script in `<head>` applying the stored choice, so nothing flashes and no media block is duplicated. One storage key across surfaces carries the choice between them.
- **No palette utility, arbitrary value or hex outside the token source**, since no theme can move it. **No class name built from strings**, which the build cannot see; a safelist is its tell. **No parallel palette** beside the package's.
- **Contrast is asserted numerically from the tokens**, in light and dark, so a token edit cannot silently break legibility; the test is in [`dev-ui-testing`](../dev-ui-testing/SKILL.md).
- **Fonts are self-hosted from a package**, so no page waits on another host.
- **Tailwind 4, its `@theme` over the roles**: CSS-first, with no config file to drift from the tokens.

## One version line

- **The design-system package and each framework major** (React, Tailwind, the bundler, TypeScript, Node) **sit at one version across their consumers**, moved by grouped automated bumps, so an upgrade is one change rather than a project per repository, and a component can move between UIs.
- **No shared package until a second consumer exists**, since one consumer cannot show which interface is shared.
- **No fork of an app**; a fork is archived, since two deploy targets of one app drift.
- **A file several repositories share comes from a reusable workflow or a package, never a copy**, since copies drift and each fix becomes a pull request per copy; the workflow's mechanics are in [`dev-ci-github`](../dev-ci-github/SKILL.md).

## Generated clients only

- **Every call goes through the client generated from the contract**, subclassed once as the session seam: the token in memory, one single-flight refresh on 401, and a timeout, so auth and failure are handled in one place.
- **No raw `fetch` write, hand-written wire type, or hand-mirrored contract**: a route the client lacks goes into the contract, since a hand copy drifts from the server unseen.
- **Strict schema validation at every data boundary**, its error naming the source, so bad data fails where it enters rather than where it renders.

## The build is the gate

The build fails on each of these, so no reviewer has to catch them; how a static site wires each is in [`dev-ui-astro`](../dev-ui-astro/SKILL.md):

- content off its schema;
- a broken internal link;
- a route missing from the inventory, which gives each route its audience and purpose;
- a link to a private or non-production host;
- a type error.

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
  - Placeholder in production copy, such as `(insert link)`.
  - A dead error branch matching a string the API never returns.
  - Content gated on visibility as the first thing on screen, so the page opens blank.
  - A split layout putting a screen of prose above a mobile form.
  - A relative `href` that resolves only from the current path.
  - A nav link to the page you are on.
- **Confirm which tree the dev server serves** before trusting a result: fetch a module only the branch has and one only the base has; exactly one returns JavaScript, the other the SPA fallback. A shell's directory can revert between commands.
- **Verify styling by computed value**: `getComputedStyle` on a representative element; screenshots break when the page is scrolled programmatically.
- **Audit chrome parity by walking the routes** with `pushState`, asserting the system's root, nav and footer are present and the old ones absent.
- **Check a dormant page behind a guard** by lifting the guard, then restoring it and grep-confirming the restore.
- **The gate sees structure, never appearance**: look at the render.
