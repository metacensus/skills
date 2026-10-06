# Licensing

## The intent

Each tracked path takes the license of the longest glob matching it in this repository's rows. A path no glob reaches, and a repository with no row, are holes to report.

## Checks

- **License text** — `LICENSE` or `COPYING` at the root holds the text of the `**` license, compared as text against the SPDX license list (licensee and ScanCode do this), not by its title.
- **Exceptions** — each path with a license other than the root's says so from inside the repository: a license file in its directory, or `SPDX-License-Identifier` headers on its files.
- **Headers** — where files carry `SPDX-License-Identifier`, each names its path's license.
- **Manifests** — every package manifest's license field (`package.json`, `Cargo.toml`, `pyproject.toml`) names the licenses of the paths it ships, as an SPDX expression where they differ.
- **Forks** — under `upstream`, the license text and any `NOTICE` equal the parent's; `gh api repos/<owner>/<name>` names the parent.
- **Copied code** — code from another project keeps its license and attribution; ScanCode finds copies a declared license hides.
- **Dependencies** — each dependency's license, from the ecosystem's tool (`go-licenses report ./...`, `npx license-checker --summary`), reported where it is unknown, absent, or marked incompatible with the license of the path that imports it.
- **Contributor terms** — what the mapping requires, a DCO or a CLA, is present and enforced: stated in `CONTRIBUTING`, and checked on pull requests.
- **Patents** — nothing in the repository states a patent position beyond the mapping's and the licenses' own terms.
