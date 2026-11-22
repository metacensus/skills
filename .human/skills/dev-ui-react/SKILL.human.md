> What a React app or plugin needs beyond what every UI shares.

Fires: a React app's or plugin's components, folders, routes, data, forms, lint or `tsconfig`; wiring a plugin into its host.

```
Components → Structure → Routing → Data → Forms → Plugins → Lint
```

## Components

Design-system package first, then Radix, a native element counting. ⚠️ No clickable `div`; `<dialog>` with `showModal()`; `aria-current` on nav. No outer layout in a component.

## Structure

`features/<feature>/` with `components/`, `data/`, `model/`. ⚠️ No `shared` or `utils`. ✅ `max-lines` 300.

## Routing

TanStack file routes in an app, plain folders and `import.meta.glob` in a plugin. ⚠️ No conventions or shims the framework ignores.

## Data

`queryOptions` once per resource, reused by loaders, components and invalidation. ✅ Every call through the session seam.

## Forms

The package's field kit; React Hook Form with zod, typed against the generated request.

## Plugins into a host

One component, one host object, no router. ⚠️ Host and plugin never cross; the host owns global styles.

## Lint and types

✅ `jsx-a11y` strict, zero warnings, import boundaries, `strict` with `noUncheckedIndexedAccess`, knip.
