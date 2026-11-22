> A cut carries one Publish: one repository's artifact out at one version. Minutes, one-way, no person of its own: its Release's yes covers the tag.

Fires: cutting, tagging or publishing a version; checking what a registry serves.

```
Plan → Change → Verify
```

|Stage|Holds|⛔|⏸️|
|---|---|---|---|
|Plan|held by a Release, blockers closed; commit = scope's last merge; range = scope; semver, breaking = minor below 1.0.0; the brief's version and commit; notes|no Release; a stray PR|tag on another commit; brief disagrees|
|Change|Release `designed` on this version and scope; tag pushed; CI publishes|no yes; failed run|·|
|Verify|registry serves CI's digest, read clean; notes on the GitHub Release; record; close|another digest, or none|·|

Each stage checks first whether it is done; each comment is the next stage's intent.

⚠️ Never re-tag or overwrite a served version: a new Publish retires it.
