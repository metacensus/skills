# Setup

Once per repository, before filing there, run `${CLAUDE_PLUGIN_ROOT}/scripts/sdlc-setup.sh OWNER/REPO [PATH | OWNER/NAME:PATH]` and act on each `TODO` it prints; rerunning is safe.

It gives each [board](../SKILL.md#mechanisms) a view per type, Status columns by Priority rows, and the Auto-add sub-issues workflow, which carries a child onto its parent's board. A board holds the Initiatives the [mapping](mapping.md)'s Boards rows give it and everything under them, the default board holding the rest.

A column `sdlc-setup.sh` finds missing is added in the board's settings, never by replacing the Status field's options through the API: that regenerates every option id and clears every card's Status, which `sdlc-status.mts OWNER/N --apply` then restores.

The forms are [forms/](../forms/), kept once in the organization's `.github` repository; a repository's own `.github/ISSUE_TEMPLATE/` replaces them whole.
