# skills

General-purpose agent skills, distributed as the `metacensus` Claude Code plugin from the `metacensus` marketplace this repository also is. Nothing here names an organization's code.

Each skill is a folder under [`skills/`](skills/), its trigger in its frontmatter; each agent a file under [`agents/`](agents/), invoked by the skill that names it.

Installed, they run as `/metacensus:<skill>` and `metacensus:<agent>`. Each AI document has a human twin under [`.human/`](.human/), the same path with `.human.md`.

## Install

Per repository, so the skills load where they are wanted and nowhere else. The repository commits `.claude/settings.json` in exactly the form the CLI writes, so an install leaves it unchanged:

```json
{
  "enabledPlugins": {
    "metacensus@metacensus": true
  },
  "extraKnownMarketplaces": {
    "metacensus": {
      "source": {
        "source": "github",
        "repo": "metacensus/skills"
      },
      "autoUpdate": true
    }
  }
}
```

and ignores `.claude/settings.local.json`, where each developer keeps their own settings.

Each developer then installs once per repository, from its main checkout; its worktrees share the install. The CLI does not register a marketplace that project settings declare, so the first command registers it, in the ignored local file:

```bash
claude plugin marketplace add metacensus/skills --scope local
```

```bash
claude plugin install metacensus@metacensus --scope project
```

The plugin works offline from then on. `autoUpdate` brings each new release in the background; run `/reload-plugins` or restart to load it.

To pin a release, name its tag as the `ref` in both places the marketplace is declared: `"ref": "v0.5.0"` beside `"repo"` in the settings, and `metacensus/skills#v0.5.0` in the first command. A tag never moves, so `autoUpdate` brings nothing until the `ref` does.

This repository's gate and `dev-ci-github`'s pre-push check scan for secrets with [gitleaks](https://github.com/gitleaks/gitleaks#installing): `brew install gitleaks`.

## Changing a skill

Run `claude --plugin-dir .` from a checkout to load your working tree in place of the installed plugin. A change reaches consumers only in a release, which raises `version` in [`plugin.json`](.claude-plugin/plugin.json).

[CI](.github/workflows/ci.yml) is the gate. Its scripts need Node 22.18 or later, which runs TypeScript directly. Markdown prose is one line per paragraph; `node scripts/check-md.mts` unwraps it. A twin holds at most a third of its AI document's words, frontmatter excluded, and carries no `#` heading; `check-cells.mts` checks both.

## License

AGPL-3.0-only ([LICENSE](LICENSE)).
