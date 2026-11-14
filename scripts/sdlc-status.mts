#!/usr/bin/env node
/* Prints each issue's status and Priority by the sdlc hub; `--apply` writes them. `ready` is taken
 * as curated: whether the body meets its form is the sweep's `mislabeled` flag. */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

type Ref = { url: string; state: string };
type Values = { nodes: { name?: string; field?: { name: string } }[] };
type Item = { id: string; project: { number: number; owner: { login: string } }; fields: Values };
type Issue = {
  id: string; url: string; state: string; stateReason: string | null;
  issueType: { name: string } | null; assignees: { totalCount: number };
  labels: { nodes: { name: string }[] };
  blockedBy: { nodes: Ref[] }; blocking: { nodes: Ref[] };
  closedByPullRequestsReferences: { nodes: { state: string }[] };
  issueFieldValues: Values;
  parent: { url: string } | null; subIssues: { nodes: { url: string }[] };
  projectItems: { nodes: Item[] };
};

const ISSUE = `id url state stateReason issueType{name} assignees{totalCount} labels(first:20){nodes{name}}
  blockedBy(first:20){nodes{url state}} blocking(first:20){nodes{url state}}
  closedByPullRequestsReferences(first:5){nodes{state}}
  issueFieldValues(first:10){nodes{... on IssueFieldSingleSelectValue{name field{... on IssueFieldSingleSelect{name}}}}}
  parent{url} subIssues(first:50){nodes{url}}
  projectItems(first:10,includeArchived:false){nodes{id project{number owner{... on Organization{login} ... on User{login}}}
    fields:fieldValues(first:50){nodes{... on ProjectV2ItemFieldSingleSelectValue{name field{... on ProjectV2SingleSelectField{name}}}}}}}`;

const gql = (query: string, vars: Record<string, string> = {}) => {
  const args = ["api", "graphql", "-f", `query=${query}`, ...Object.entries(vars).flatMap(([k, v]) => ["-F", `${k}=${v}`])];
  const out = JSON.parse(execFileSync("gh", args, { encoding: "utf8", maxBuffer: 1 << 28 }));
  if (out.errors) throw new Error(JSON.stringify(out.errors));
  return out.data;
};

const argv = process.argv.slice(2);
const apply = argv.includes("--apply");
const reset = argv.includes("--reset");
const mappingAt = argv.indexOf("--mapping");
const targets = argv.filter((a, i) => !a.startsWith("--") && (mappingAt < 0 || i !== mappingAt + 1));
if (!targets.length) {
  console.error("usage: sdlc-status.mts OWNER/N | OWNER/REPO#N... [--mapping PATH | OWNER/NAME:PATH] [--apply] [--reset]");
  process.exit(2);
}

// A section's body rows, first cell to second, holes left out.
const table = new Map<string, Map<string, string>>();
if (mappingAt >= 0) {
  const at = argv[mappingAt + 1];
  const remote = at.match(/^([^/:]+\/[^:]+):(.+)$/);
  const text = remote
    ? execFileSync("gh", ["api", "-H", "Accept: application/vnd.github.raw", `repos/${remote[1]}/contents/${remote[2]}`], { encoding: "utf8" })
    : readFileSync(at, "utf8");
  let rows = new Map<string, string>();
  for (const line of text.split("\n")) {
    if (line.startsWith("## ")) table.set(line.slice(3), (rows = new Map()));
    const cells = line.split("|").slice(1, -1).map((c) => c.trim().replaceAll("`", ""));
    if (cells.length >= 2 && !/^[-: ]+$/.test(cells[0]) && !cells[1].includes("Hole")) rows.set(cells[0], cells[1]);
  }
}
const columns = table.get("Status") ?? new Map<string, string>();
const readyLabel = table.get("Labels")?.get("ready") ?? "ready";
const column = (status: string) => columns.get(status) ?? status;

const issues = new Map<string, Issue>();
const fetchIssue = (url: string) => {
  if (!issues.has(url)) issues.set(url, gql(`query($u:URI!){resource(url:$u){... on Issue{${ISSUE}}}}`, { u: url }).resource);
  return issues.get(url)!;
};
const toUrl = (t: string) => {
  const m = t.match(/^([^/]+)\/([^#]+)#(\d+)$/);
  return m ? `https://github.com/${m[1]}/${m[2]}/issues/${m[3]}` : t;
};

const board1 = targets.length === 1 && /^[^/]+\/\d+$/.test(targets[0]) ? targets[0] : null;
let scope: string[] = [];
if (board1) {
  const [owner, number] = board1.split("/");
  let after = "";
  for (;;) {
    const page = gql(
      `query($o:String!,$n:Int!,$c:String){repositoryOwner(login:$o){... on ProjectV2Owner{projectV2(number:$n){items(first:25,after:$c){
        pageInfo{endCursor hasNextPage} nodes{content{... on Issue{${ISSUE}}}}}}}}}`,
      { o: owner, n: number, ...(after ? { c: after } : {}) },
    );
    const items = page.repositoryOwner.projectV2.items;
    for (const node of items.nodes) if (node.content?.url) { issues.set(node.content.url, node.content); scope.push(node.content.url); }
    if (!items.pageInfo.hasNextPage) break;
    after = items.pageInfo.endCursor;
  }
} else scope = targets.map((t) => fetchIssue(toUrl(t)).url);

// `--reset`: every issue under the targets drops its own Priority and inherits again.
const below = new Set<string>();
if (reset) for (const url of scope) for (const c of fetchIssue(url).subIssues.nodes) if (!below.has(c.url)) { below.add(c.url); scope.push(c.url); }

const isParent = (i: Issue) => i.issueType?.name === "Epic" || i.issueType?.name === "Initiative";
const status = (url: string): string => {
  const i = fetchIssue(url);
  const openBlocker = i.blockedBy.nodes.some((b) => b.state === "OPEN");
  const started = isParent(i) && i.subIssues.nodes.some((c) => ["In progress", "In review", "Done"].includes(status(c.url)));
  return i.state === "CLOSED" ? (i.stateReason === "COMPLETED" ? "Done" : "Dropped")
    : i.closedByPullRequestsReferences.nodes.some((p) => p.state === "OPEN") ? "In review"
    : i.assignees.totalCount > 0 || started ? "In progress"
    : i.labels.nodes.some((l) => l.name === readyLabel) && !openBlocker ? "Ready"
    : openBlocker ? "Blocked" : "Backlog";
};

const org = board1 ? board1.split("/")[0] : new URL(scope[0]).pathname.split("/")[1];
const field = (gql(`query($o:String!){organization(login:$o){issueFields(first:50){nodes{... on IssueFieldSingleSelect{id name options{id name priority}}}}}}`, { o: org })
  .organization?.issueFields.nodes ?? []).find((f: { name?: string }) => f.name === "Priority");
const rank = new Map<string, number>((field?.options ?? []).map((o: { name: string; priority: number }) => [o.name, o.priority]));
const pick = (v: Values, name: string) => v.nodes.find((n) => n.field?.name === name)?.name ?? null;
const stored = (i: Issue) => pick(i.issueFieldValues, "Priority");
const own = (i: Issue) => (below.has(i.url) ? null : stored(i));
const higher = (a: string | null, b: string | null) => (!a ? b : !b ? a : rank.get(a)! <= rank.get(b)! ? a : b);
const inherited = new Map<string, string | null>();
const inherit = (url: string, seen = new Set<string>()): string | null => {
  if (inherited.has(url)) return inherited.get(url)!;
  if (seen.has(url)) return null;
  seen.add(url);
  const i = fetchIssue(url);
  let p = own(i) ?? (i.parent ? inherit(i.parent.url, seen) : null);
  if (!own(i)) for (const b of i.blocking.nodes) if (b.state === "OPEN") p = higher(p, inherit(b.url, seen));
  inherited.set(url, p);
  return p;
};

const initiative = (url: string): string | null => {
  const i = fetchIssue(url);
  return i.issueType?.name === "Initiative" ? url : i.parent ? initiative(i.parent.url) : null;
};

type Select = { id: string; options: Map<string, string> };
const boards = new Map<string, { id: string; fields: Map<string, Select> }>();
const keyOf = (item: Item) => `${item.project.owner.login}/${item.project.number}`;
const board = (item: Item) => {
  const key = keyOf(item);
  if (!boards.has(key)) {
    const p = gql(`query($o:String!,$n:Int!){repositoryOwner(login:$o){... on ProjectV2Owner{projectV2(number:$n){id
      fields(first:50){nodes{... on ProjectV2SingleSelectField{id name options{id name}}}}}}}}`,
      { o: item.project.owner.login, n: String(item.project.number) }).repositoryOwner.projectV2;
    const fields = new Map<string, Select>();
    for (const f of p.fields.nodes) if (f.options) fields.set(f.name, { id: f.id, options: new Map(f.options.map((o: { id: string; name: string }) => [o.name, o.id])) });
    boards.set(key, { id: p.id, fields });
  }
  return boards.get(key)!;
};
const setCard = (item: Item, name: string, value: string) => {
  const b = board(item), f = b.fields.get(name)!;
  gql(`mutation($p:ID!,$i:ID!,$f:ID!,$o:String!){updateProjectV2ItemFieldValue(input:{projectId:$p,itemId:$i,fieldId:$f,value:{singleSelectOptionId:$o}}){clientMutationId}}`,
    { p: b.id, i: item.id, f: f.id, o: f.options.get(value)! });
};

const carried = (key: string) => [...(table.get("Inherited fields") ?? [])].filter(([, b]) => b.split(/\s+/).includes(key)).map(([f]) => f);
const inheritCard = (url: string, key: string, name: string): string | null => {
  const i = fetchIssue(url), item = i.projectItems.nodes.find((n) => keyOf(n) === key);
  return (item ? pick(item.fields, name) : null) ?? (i.parent ? inheritCard(i.parent.url, key, name) : null);
};

for (const url of scope) {
  const i = fetchIssue(url);
  const s = status(url);
  const p = inherit(url);
  const notes: string[] = [];
  const want = column(s);
  for (const item of i.projectItems.nodes) {
    const key = keyOf(item);
    if (board1 && key !== board1) continue;
    const now = pick(item.fields, "Status");
    if (want === "—") {
      notes.push(`${key}: archive`);
      if (apply) execFileSync("gh", ["project", "item-archive", String(item.project.number), "--owner", item.project.owner.login, "--id", item.id]);
      continue;
    }
    if (now !== want) {
      const exists = board(item).fields.get("Status")?.options.has(want);
      notes.push(exists ? `${key}: ${now ?? "no column"} → ${want}` : `${key}: no column ${want}`);
      if (apply && exists) setCard(item, "Status", want);
    }
    for (const name of carried(key)) {
      const wants = inheritCard(url, key, name);
      if (wants && wants !== pick(item.fields, name)) { notes.push(`${key}: ${name} → ${wants}`); if (apply) setCard(item, name, wants); }
      else if (!wants && i.state === "OPEN" && ["Epic", "Task", "Bug"].includes(i.issueType?.name ?? "")) notes.push(`${key}: no ${name}`);
    }
  }
  if (field && p && !own(i) && stored(i) !== p) {
    notes.push(`priority → ${p}`);
    if (apply)
      gql(`mutation($i:ID!,$f:ID!,$o:ID!){setIssueFieldValue(input:{issueId:$i,issueFields:[{fieldId:$f,singleSelectOptionId:$o}]}){clientMutationId}}`,
        { i: i.id, f: field.id, o: field.options.find((o: { name: string }) => o.name === p).id });
  }
  for (const b of i.blocking.nodes)
    if (i.state === "OPEN" && b.state === "OPEN" && own(i) && rank.get(own(i)!)! > (rank.get(inherit(b.url) ?? "") ?? Infinity))
      notes.push(`blocks higher: ${b.url}`);
  console.log([url, s, p ?? "—", initiative(url) ?? "—", ...notes].join("\t"));
}
