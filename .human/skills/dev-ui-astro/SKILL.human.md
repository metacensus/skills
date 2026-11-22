> A static site with Astro, beyond what [`dev-ui`](../dev-ui/SKILL.human.md) shares.

Fires: an Astro site's pages, content, integrations or config; a `client:` directive; a new collection, route or form.

```
Islands → Collections → MDX → Gate → Sitemaps and icons → Form → Siblings
```

## Islands

`client:visible` by default, `client:load` above the fold. ✅ Chrome static; a kit wrapper fixes each directive.

## Content collections

Strict schemas; `id` from the file name. ⚠️ One draft filter for every path. ✅ A repeated section becomes a field.

## MDX

Reading time from the parsed tree. ⚠️ No regex over the source.

## Wiring the gate

Schemas, `astro check`, then one integration at `astro:build:done` checks routes and links. ⚠️ Staging, local and internal hosts denied; a repository passes only if public.

## Sitemaps and icons

One sitemap per base. ✅ Icons rasterised at build from one mark; no binaries committed.

## A form on a static page

Generated client with a timeout; a ref guards double submit. ✅ `aria-busy`, status or alert focused, input kept, honeypot, privacy notice beside Send.

## Sibling sites

Kit, CI and config from a package. ⚠️ Styles stay in their components.
