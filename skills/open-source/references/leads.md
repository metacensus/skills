# Leads

## Defaults

Every check follows these, plus the mapping's own.

| Lead | What it reaches |
|---|---|
| Strategy | Plans, positioning, funding, pitches, and positions not yet settled |
| Companies and people | Partners, prospects, funders, customers, stakeholders, contacts, and the relationship with each |
| Figures | Prices, revenue, funding amounts, valuations, salaries, headcounts |
| Internal names | Project, product, and code names not yet public |
| Hosts | Internal hostnames and URLs, private addresses, cloud account and project ids |
| Secrets | Keys, tokens, passwords, private keys, connection strings |
| Personal data | Email addresses, phone numbers, postal addresses, health or identity data, real people in fixtures |

## The session's copy

The orchestrator pins the leads in session scratch, outside every repository, before any scanner starts, and deletes them when the work ends:

- **`leads`** — the defaults above and the mapping's own, one per line: the lead, a tab, what it reaches.
- **`examples`**, where the mapping points at any — one per line: the lead, a tab, the example. Take what its sources hold, with each name's distinctive tokens: a surname, an acronym, a slug. A lead with none is followed by judgement alone, and the report says so.
