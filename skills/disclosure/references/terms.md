# Terms

## Categories

| Category | What it is |
|---|---|
| People | Names of people the project does not publish: stakeholders, partners' and prospects' staff, contacts |
| Organizations | Partners, prospects, funders, customers, and the relationship with each |
| Internal names | Project, product, and code names not yet public |
| Figures | Prices, revenue, funding amounts, valuations, salaries, headcounts |
| Hosts | Internal hostnames and URLs, private addresses, cloud account and project ids |
| Secrets | Keys, tokens, passwords, private keys, connection strings |
| Personal data | Email addresses, phone numbers, postal addresses, health or identity data, real people in fixtures |

A listed name that is also a public dependency, an upstream project, or the project's own public name is not a leak where it means that.

## Deriving the list

- **Derive, never keep.** Read each source the mapping names and take its fields' values. A hand-kept list is a second copy of internal facts, and drifts from the records it copies.
- **Expand mechanically.** Each value, its id or slug, and its distinctive tokens — a surname, an acronym. What expansion cannot reach, the scanner's variant matching does.
- **`terms.tsv`, one line per term: its category, a tab, the term.**
- **The list lives in session scratch**, outside every repository, and is deleted when the work ends.
- **A category with no source is covered by judgement alone**, and the report says so.
