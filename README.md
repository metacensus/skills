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

The plugin works offline from then on. `autoUpdate` brings each new commit on `main` in the background; run `/reload-plugins` or restart to load it.

## Changing a skill

Run `claude --plugin-dir .` from a checkout to load your working tree in place of the installed plugin. Every commit is a release: neither manifest sets `version`, so the commit SHA is the version.

[CI](.github/workflows/ci.yml) is the gate. `scripts/check-cells.mts` needs Node 22.18 or later, which runs TypeScript directly.
