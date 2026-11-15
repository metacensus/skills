> Leads are the kinds of internal information every check follows; the orchestrator pins them in session scratch before any scanner starts.

Fires: any check, as the lead list it follows. Part of [open-source](../SKILL.human.md); drives [review](review.human.md) and [init](init.human.md).

```
defaults + mapping's own → leads (pinned in session scratch)
                           examples (where the mapping points)
                                  ↓
                  scan → triage → checked against all leads
```

## Defaults

Every check follows these, plus the mapping's own.

| Lead | Reaches |
|---|---|
| Strategy | plans · positioning · funding · pitches · positions not yet settled |
| Companies and people | partners · prospects · funders · customers · stakeholders · contacts · the relationship with each |
| Figures | prices · revenue · funding amounts · valuations · salaries · headcounts |
| Internal names | project, product, code names not yet public |
| Hosts | internal hostnames and URLs · private addresses · cloud account and project ids |
| Secrets | keys · tokens · passwords · private keys · connection strings |
| Personal data | emails · phones · postal addresses · health or identity data · real people in fixtures |

## The session's copy

The orchestrator pins both files in session scratch, outside every repository, before any scanner starts. 🟢 It deletes them when the work ends.

| File | Holds | Per line | Absent means |
|---|---|---|---|
| `leads` | defaults above plus the mapping's own | lead · tab · what it reaches | · |
| `examples` | what the mapping points at | lead · tab · the example | that lead is followed by judgement alone; ⚠️ the report says so |

An example takes what its sources hold, with each name's distinctive tokens: a surname, an acronym, a slug.
