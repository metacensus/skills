# skills

General-purpose agent skills, distributed as the `metacensus` Claude Code plugin from the `metacensus` marketplace this repository also is. Nothing here names an organization's code.

Each skill is a folder under [`skills/`](skills/), its trigger in its frontmatter; each agent a file under [`agents/`](agents/), invoked by the skill that names it.

Installed, they run as `/metacensus:<skill>` and `metacensus:<agent>`. Each AI document has a human twin under [`.human/`](.human/), the same path with `.human.md`.

## Install

Once per machine. Claude Code fetches this private repository with non-interactive git, so store a credential first:

```bash
gh auth login && gh auth setup-git
```

Then add to `~/.claude/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "metacensus": { "source": { "source": "github", "repo": "metacensus/skills" }, "autoUpdate": true }
  },
  "enabledPlugins": { "metacensus@metacensus": true }
}
```

The plugin installs at the next session start and works offline from then on. `autoUpdate` brings each new commit on `main` in the background; run `/reload-plugins` or restart to load it.

## Changing a skill

Run `claude --plugin-dir .` from a checkout to load your working tree in place of the installed plugin. Every commit is a release: neither manifest sets `version`, so the commit SHA is the version.

[CI](.github/workflows/ci.yml) is the gate. `scripts/check-cells.mts` needs Node 22.18 or later, which runs TypeScript directly.
