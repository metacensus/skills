> One probe answers survey and verification.

Fires: a pin, label, workflow, plugin or setting due across repositories; which still lack one.

```
Probe → Survey → ⛔ List → Pilot → Fan-out → Verify → Report
```

| Step | Does |
|---|---|
| Probe | read-only API command, 0 when present |
| Survey | every source repository: needs · has · skips |
| ⛔ List | the person confirms list and change |
| Change | pinned in a file; misfits escalate |
| Pilot | one repository end to end |
| Per repository | a PR naming, not closing, the issue · label or setting: an API write · merge per [`land`](../land/SKILL.human.md) |
| Fan-out | per [`parallelize`](../parallelize/SKILL.human.md); consumed repositories first |
| Verify | probe again; one live check |
| Report | per repository: before, PR, merged, after |
