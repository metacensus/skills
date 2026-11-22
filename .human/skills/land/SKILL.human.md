> Landing ends when what merged is published and its consumers run it; work blocking an open Release, itself or through its Epic, ends at the merge.

Fires: tagging, rerunning, or verifying a release.

```
Release → Verify → Bump
```

A Release ships once nothing blocking it is open, and closes once its consumers run it.

Merging and waiting are [`sdlc-author`'s Land](../sdlc-author/SKILL.human.md#land).
