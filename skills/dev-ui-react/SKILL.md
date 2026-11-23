---
name: dev-ui-react
description: What a React app, or a plugin into a host, needs beyond what every UI shares — primitives from the design system and native elements, feature folders, the router's own routes, query options over the session seam, one field kit and one validator, the plugin contract, and lint and types as the gate. Trigger when scaffolding, reviewing, or changing a React app's or plugin's components, folders, routes, data fetching, forms, lint config or `tsconfig`, and when wiring a plugin into its host.
---

## Components

- **Primitives come from the design-system package first**; Radix, the one headless library, only where the package has no equivalent, a native element counting as an equivalent. A primitive neither holds is built once in the app's `ui/` and moves into the package when a second UI needs it ([`dev-ui`](../dev-ui/SKILL.md#one-version-line)), so each primitive has one way to be made.
- **Anything clickable is a `<button type="button">` or an `<a>`, never a clickable `div`**, which gets no focus, keyboard or role.
- **A dialog is a native `<dialog>` opened with `showModal()`**, which brings focus, Escape and the top layer without a library.
- **Navigation marks its current link `aria-current="page"`**, so a screen reader hears where it is.
- **A component sets no position, outer margin or width of its own**, so its parent places it and it fits any page.

## Structure

- **`features/<feature>/` holds its `components/`, `data/` and `model/`**, the model pure logic with no React and its tests beside it (layers in [`dev-ui-testing`](../dev-ui-testing/SKILL.md)), so a feature is read, tested and deleted as one folder.
- **`routes/` is the router's; `ui/` holds only the primitives above.**
- **No folder named for nothing** (`shared`, `partials`, `common`, `utils`): what two features share is a primitive or a feature of its own, since a bucket gathers what nobody placed.
- **ESLint's `max-lines` at 300 on hand-written source**, generated files excluded, so a file stays reviewable and the limit is an error rather than a reviewer's memory.

## Routing

- **An app uses TanStack Router's file-based routes**, a file beside a route that is not one carrying the router's `-` ignore prefix, so the folder tree is the route table.
- **A plugin uses plain folders**, `routes/<name>/page.tsx` collected lazily by `import.meta.glob`, since it brings no router and a new page then edits no registry.
- **A convention the running framework ignores goes**, with any shim for another framework's API: `"use client"` in a Vite app, or folder names promising file routes over a hand-written router, each promising behavior that does not exist.

## Data

- **Each resource's `queryOptions` is defined once in its feature's `data/`**: route loaders `ensureQueryData` that object, components read it with the same object, and mutations invalidate its key, so no key is written twice.
- **Every query and mutation function calls the generated client through the session seam** ([`dev-ui`](../dev-ui/SKILL.md#generated-clients-only)); no second fetch hook or HTTP library sits beside it.

## Forms

- **The design-system package's field kit wires each control's label, description and error** (`id`, `htmlFor`, `aria-describedby`, `aria-invalid`) by construction, so no form wires them by hand.
- **Every form is React Hook Form with its zod resolver**, zod being the one validator the app's data boundaries already use, and the schema is typed against the generated request type, so a form cannot drift from the contract.
- **A form submits as [`dev-ui`](../dev-ui/SKILL.md#submitting-a-form) says**, its double-submit guard a ref.

## Plugins into a host

- **A plugin's entry exports one default component taking one host object**, which carries its base, navigation and data; it brings no router and no client of its own, so the host owns each.
- **The host's build plugin fails the build when host and plugin code cross.**
- **The host owns resets and global styles; a plugin scopes its CSS under its own root class.** A host style a plugin must undo is fixed in the host or the library it gives its plugins, never in each plugin.

## Lint and types

- **ESLint flat config with typescript-eslint, `react-hooks` and `jsx-a11y`'s strict set, run with `--max-warnings 0`**, so no warning accumulates; `jsx-a11y` is what catches the clickable `div`.
- **`no-restricted-imports` enforces the boundaries**, its message giving the reason: no feature reaches into another's folders, and `ui/` imports no feature.
- **`tsconfig` sets `strict` and `noUncheckedIndexedAccess`**, so an index read is typed as possibly missing.
- **knip fails on an unused file, export or dependency**; an overlapping one (a second headless library, HTTP client or validator) is the review's, since no tool sees two libraries doing one job.
- **All of it runs in the gate** ([`dev-ui`](../dev-ui/SKILL.md#the-build-is-the-gate)).
