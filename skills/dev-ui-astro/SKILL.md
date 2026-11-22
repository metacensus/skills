---
name: dev-ui-astro
description: How a static site is built with Astro beyond what every UI shares — islands, content collections, MDX, the build's gate wired, sitemaps and icons, a form on a static page, and styles scoped to their components. Trigger when writing or reviewing an Astro site's pages, components, content, integrations or `astro.config`, when choosing a `client:` directive, when adding a collection, an MDX plugin, a route or a form, and when wiring a static site's gate.
---

What every UI shares is in [`dev-ui`](../dev-ui/SKILL.md); how a site is tested, in [`dev-ui-testing`](../dev-ui-testing/SKILL.md).

## Islands

- **A component hydrates only where a page marks it**, as [`dev-ui`](../dev-ui/SKILL.md#one-image-every-environment) renders to files: `client:visible` by default, since a visible island costs nothing until scrolled to, and `client:load` only above the fold.
- **Chrome takes no directive**: header, nav and footer render static.
- **A kit component that hydrates ships with an `.astro` wrapper fixing its directive**, and a site renders the wrapper, so one component cannot hydrate on load on one site and on visibility on another.

## Content collections

- **Each collection is defined in `src/content.config.ts`** with the `glob` loader and a strict schema, so content off its schema fails the build.
- **The entry's `id` comes from its file name**; no field repeats it, so the two cannot disagree.
- **Drafts carry `draft`, filtered by one function** that every listing, route, feed and sitemap calls, visible only under `import.meta.env.DEV`, since a draft leaks through whichever path forgets.
- **A section every entry repeats becomes a schema field** the layout renders as its heading, so the shape is checked rather than copied.

## MDX

- **Anything computed from content works on the parsed tree**: reading time is a remark plugin counting the mdast's text, exposed through `remarkPluginFrontmatter`, since a regex over the source miscounts nested JSX and code.

## Wiring the gate

Each item at [`dev-ui`](../dev-ui/SKILL.md#the-build-is-the-gate) fails an Astro build:

- **Content**: by the collection schemas.
- **Types**: by `astro check` before `astro build`.
- **The rest**: by one integration at `astro:build:done` over the built pages, so the build itself fails rather than a suite someone must run. It:
  - reads `routes.json`, each route's audience and purpose, and fails on a route built but unlisted or listed but not built;
  - regenerates `ROUTES.md`: chrome's links once, then each page's links and forms in `<main>`, so a footer link is not repeated per page;
  - fails on a broken internal link;
  - fails on a link to a staging, local or internal host, denied by pattern, and on a link to an organization repository that [`launch-review`](../launch-review/SKILL.md#private-links)'s public list does not name, since a list of private repositories would publish their names and pass the next one created.

## Sitemaps and icons

- **`@astrojs/sitemap` takes `site` from the one canonical origin**, so each site under a prefix emits its own sitemap under its base; drafts and the 404 are excluded. Which sitemaps `robots.txt` names: [`launch-review`](../launch-review/SKILL.md#robots-and-sitemap).
- **Icons come from an endpoint**, `src/pages/[icon].png.ts` with `getStaticPaths` over the sizes, rasterising the design-system package's mark with `sharp` at build, and the `.ico` is packed from those PNGs. No binary icon is committed, so a rebrand is one file. The set: [`launch-review`](../launch-review/SKILL.md#favicons).

## A form on a static page

- **An island posts through the generated client with a timeout**, the seam [`dev-ui`](../dev-ui/SKILL.md#generated-clients-only) sets.
- **A ref, not state, guards double submit**, since state updates only after the next render.
- **`aria-busy` while sending.** On success, focus moves to a `role="status"` panel; on error, to a `role="alert"` notice, and the fields keep what was typed.
- **A honeypot field**, hidden from people and assistive tech, drops bots without a challenge.
- **The privacy notice is linked beside Send**, as [`launch-review`](../launch-review/SKILL.md#privacy-notice) requires.
- Field wiring and the validator: [`dev-ui-react`](../dev-ui-react/SKILL.md).

## Sibling sites

- **Kit, CI and config come from a package or reusable workflow**, per [`dev-ui`](../dev-ui/SKILL.md#one-version-line).
- **The global sheet holds only the layer order and the package's imports**; every other rule sits in the component that owns it, an `.astro` file's scoped `<style>` or utilities over the roles, so a page's styles are deleted with the page.
