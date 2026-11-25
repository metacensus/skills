#!/usr/bin/env node
/* Prints each issue's status and Priority by the sdlc hub; `--apply` writes them. `ready` is taken
 * as curated: whether the body meets its form is the sweep's `mislabeled` flag. */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { table } from "./mapping.mts";

type Ref = { url: string; state: string; issueType: { name: string } | null };
type Values = { nodes: { name?: string; field?: { name: string } }[] };
type Item = { id: string; project: { number: number; owner: { login: string } }; values: Record<string, string | null> };
type Issue = {
  id: string; url: string; state: string; stateReason: string | null;
  issueType: { name: string } | null; assignees: { totalCount: number };
  labels: { nodes: { name: string }[] };
  issueDependenciesSummary: { blockedBy: number }; blocking: { nodes: Ref[] };
  closedByPullRequestsReferences: { nodes: { state: string }[] };
  issueFieldValues: Values;
  parent: { url: string } | null; subIssues: { nodes: { url: string }[] };
  projectItems: { nodes: Item[] };
};

const pause = (ms: number) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);

// GitHub's gateway answers 502/503/504 now and then: retry those. A rate limit ends the run, cleanly: what was
// written stays written, and a rerun diffs against it.
// With `partial`, a response that carries both data and errors returns them, the errors under `errors`.
// -F would read an all-digit string, such as an option id, as a number.
const gql = (query: string, vars: Record<string, string | number> = {}, partial = false) => {
  const args = ["api", "graphql", "-f", `query=${query}`, ...Object.entries(vars).flatMap(([k, v]) => [typeof v === "number" ? "-F" : "-f", `${k}=${v}`])];
  for (let attempt = 1; ; attempt++) {
    try {
      const out = JSON.parse(execFileSync("gh", args, { encoding: "utf8", maxBuffer: 1 << 28, stdio: ["ignore", "pipe", "pipe"] }));
      if (out.errors) throw new Error(JSON.stringify(out.errors));
      return out.data;
    } catch (e) {
      const said = `${(e as { stdout?: string }).stdout ?? ""}${(e as { stderr?: string }).stderr ?? ""}`;
      if (partial) {
        try {
          const out = JSON.parse((e as { stdout?: string }).stdout ?? "");
          if (out.data && out.errors && !/rate limit/i.test(said)) return { ...out.data, errors: out.errors };
        } catch { /* not a response: fall through */ }
      }
      if (/rate limit/i.test(said)) {
        console.error("GitHub rate limit: wait for it to reset (`gh api rate_limit`) and rerun; a rerun skips what is written.");
        process.exit(75);
      }
      if (attempt < 3 && /HTTP 50[234]/.test(said)) { pause(2000 * attempt); continue; }
      throw e;
    }
  }
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

// A section's rows, first cell to second.
const sections = new Map<string, Map<string, string>>();
if (mappingAt >= 0) {
  const at = argv[mappingAt + 1];
  const remote = at.match(/^([^/:]+\/[^:]+):(.+)$/);
  const text = remote
    ? execFileSync("gh", ["api", "-H", "Accept: application/vnd.github.raw", `repos/${remote[1]}/contents/${remote[2]}`], { encoding: "utf8" })
    : readFileSync(at, "utf8");
  for (const name of ["Status", "Labels", "Inherited fields"]) sections.set(name, new Map(table(text, name).rows.filter((r) => r.length > 1).map(([k, v]) => [k, v])));
}
const columns = sections.get("Status") ?? new Map<string, string>();
const readyLabel = sections.get("Labels")?.get("ready") ?? "ready";
const column = (status: string) => columns.get(status) ?? status;

// A card is read by the names of the fields this run uses (`fieldValueByName` costs no extra request per card, where
// a card's whole `fieldValues` connection costs one per card), each under an alias `v0`, `v1`, …
const cardFields = [...new Set(["Status", ...(sections.get("Inherited fields")?.keys() ?? [])])];
const ISSUE = `id url state stateReason issueType{name} assignees{totalCount} labels(first:20){nodes{name}}
  issueDependenciesSummary{blockedBy} blocking(first:100){nodes{url state issueType{name}}}
  closedByPullRequestsReferences(first:5){nodes{state}}
  issueFieldValues(first:10){nodes{... on IssueFieldSingleSelectValue{name field{... on IssueFieldSingleSelect{name}}}}}
  parent{url} subIssues(first:50){nodes{url}}
  projectItems(first:10,includeArchived:false){nodes{id project{number owner{... on Organization{login} ... on User{login}}}
    ${cardFields.map((n, k) => `v${k}:fieldValueByName(name:${JSON.stringify(n)}){... on ProjectV2ItemFieldSingleSelectValue{name}}`).join(" ")}}}`;

const issues = new Map<string, Issue>();
const store = (raw: Issue & { projectItems: { nodes: (Item & Record<string, { name?: string } | null>)[] } }) => {
  for (const item of raw.projectItems.nodes) item.values = Object.fromEntries(cardFields.map((n, k) => [n, item[`v${k}`]?.name ?? null]));
  issues.set(raw.url, raw);
  return raw;
};
const resource = (url: string) => gql(`query($u:URI!){resource(url:$u){__typename url ... on Issue{${ISSUE}}}}`, { u: url }).resource;
const fetchIssue = (url: string) => issues.get(url) ?? store(resource(url));

// Reads the issues not yet held, 25 to a request; whatever it leaves is read one at a time when asked for.
const fetchMany = (urls: string[]) => {
  for (let i = 0; i < urls.length; i += 25) {
    const batch = urls.slice(i, i + 25);
    const data = gql(`query{${batch.map((u, k) => `i${k}:resource(url:${JSON.stringify(u)}){... on Issue{${ISSUE}}}`).join(" ")}}`);
    batch.forEach((_, k) => store(data[`i${k}`]));
  }
};
// Reads what `edges` reaches from `roots`, a level at a time.
const reach = (roots: string[], edges: (i: Issue) => (string | undefined)[]) => {
  const seen = new Set<string>();
  for (let level = roots; level.length; ) {
    level = [...new Set(level)].filter((u) => !seen.has(u));
    level.forEach((u) => seen.add(u));
    fetchMany(level.filter((u) => !issues.has(u)));
    level = level.flatMap((u) => edges(issues.get(u)!)).filter((u): u is string => !!u);
  }
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
      `query($o:String!,$n:Int!,$c:String){repositoryOwner(login:$o){... on ProjectV2Owner{projectV2(number:$n){items(first:100,after:$c){
        pageInfo{endCursor hasNextPage} nodes{content{... on Issue{${ISSUE}}}}}}}}}`,
      { o: owner, n: Number(number), ...(after ? { c: after } : {}) },
    );
    const items = page.repositoryOwner.projectV2.items;
    for (const node of items.nodes) if (node.content?.url) { store(node.content); scope.push(node.content.url); }
    if (!items.pageInfo.hasNextPage) break;
    after = items.pageInfo.endCursor;
  }
} else
  // GitHub reads a pull request's number as an Issue at its `/pull/` url.
  for (const url of targets.map(toUrl)) {
    const r = resource(url), kind = /\/pull\/\d+$/.test(r?.url) ? "PullRequest" : r?.__typename;
    if (kind === "Issue") scope.push(store(r).url);
    else console.error(`${url}: skipped, ${kind ? `a ${kind}, not an issue` : "not found or not readable"}`);
  }
if (!scope.length) process.exit(board1 ? 0 : 1);

// `--reset`: every issue under the targets drops its own Priority and inherits again.
const below = new Set<string>();
if (reset) for (const url of scope) for (const c of fetchIssue(url).subIssues.nodes) if (!below.has(c.url)) { below.add(c.url); scope.push(c.url); }

// Ancestors are read in batches, as are a parent's children when its status asks; an issue a Priority walk
// alone reaches is read as the walk asks.
reach(scope, (i) => [i.parent?.url]);
fetchMany([...new Set(scope.flatMap((u) => issues.get(u)!.subIssues.nodes.map((c) => c.url)))].filter((u) => !issues.has(u)));
const status = (url: string): string => {
  const i = fetchIssue(url);
  fetchMany(i.subIssues.nodes.map((c) => c.url).filter((u) => !issues.has(u)));
  const openBlocker = i.issueDependenciesSummary.blockedBy > 0;
  const started = i.subIssues.nodes.some((c) => ["In progress", "In review", "Done"].includes(status(c.url)));
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
const raises = (b: Ref) => b.state === "OPEN" && !["Publish", "Release", "Rollout"].includes(b.issueType?.name ?? "");
const inherited = new Map<string, string | null>();
const inherit = (url: string, seen = new Set<string>()): string | null => {
  if (inherited.has(url)) return inherited.get(url)!;
  if (seen.has(url)) return null;
  seen.add(url);
  const i = fetchIssue(url);
  let p = own(i) ?? (i.parent ? inherit(i.parent.url, seen) : null);
  if (!own(i)) for (const b of i.blocking.nodes) if (raises(b)) p = higher(p, inherit(b.url, seen));
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
      { o: item.project.owner.login, n: item.project.number }).repositoryOwner.projectV2;
    const fields = new Map<string, Select>();
    for (const f of p.fields.nodes) if (f.options) fields.set(f.name, { id: f.id, options: new Map(f.options.map((o: { id: string; name: string }) => [o.name, o.id])) });
    boards.set(key, { id: p.id, fields });
  }
  return boards.get(key)!;
};
// Writes queue and go out 25 to a request, a second apart: one request carries what 25 would.
// A write GitHub refuses is reported with its issue and the rest still go out; the run then exits 1.
const writes: { what: string; mutation: string }[] = [];
const flush = () => {
  for (let i = 0; i < writes.length; i += 25) {
    if (i) pause(1000);
    const batch = writes.slice(i, i + 25);
    const { errors = [] } = gql(`mutation{${batch.map((w, k) => `w${k}:${w.mutation}`).join(" ")}}`, {}, true);
    for (const e of errors as { path: string[]; message: string }[]) {
      console.error(`${batch[Number(e.path[0].slice(1))].what}: ${e.message}`);
      process.exitCode = 1;
    }
  }
};
const queue = (what: string, mutation: string) => writes.push({ what, mutation: `${mutation}{clientMutationId}` });
const setCard = (url: string, item: Item, name: string, value: string) => {
  const b = board(item), f = b.fields.get(name)!;
  queue(`${url} ${keyOf(item)} ${name} → ${value}`,
    `updateProjectV2ItemFieldValue(input:{projectId:${JSON.stringify(b.id)},itemId:${JSON.stringify(item.id)},fieldId:${JSON.stringify(f.id)},value:{singleSelectOptionId:${JSON.stringify(f.options.get(value))}}})`);
};
const archiveCard = (url: string, item: Item) =>
  queue(`${url} ${keyOf(item)} archive`, `archiveProjectV2Item(input:{projectId:${JSON.stringify(board(item).id)},itemId:${JSON.stringify(item.id)}})`);

const carried = (key: string) => [...(sections.get("Inherited fields") ?? [])].filter(([, b]) => b.split(/\s+/).includes(key)).map(([f]) => f);
const inheritCard = (url: string, key: string, name: string): string | null => {
  const i = fetchIssue(url), item = i.projectItems.nodes.find((n) => keyOf(n) === key);
  return item?.values[name] ?? (i.parent ? inheritCard(i.parent.url, key, name) : null);
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
    const now = item.values.Status;
    if (want === "—") {
      notes.push(`${key}: archive`);
      if (apply) archiveCard(url, item);
      continue;
    }
    if (now !== want) {
      const exists = board(item).fields.get("Status")?.options.has(want);
      notes.push(exists ? `${key}: ${now ?? "no column"} → ${want}` : `${key}: no column ${want}`);
      if (apply && exists) setCard(url, item, "Status", want);
    }
    for (const name of carried(key)) {
      const wants = inheritCard(url, key, name);
      if (wants && wants !== item.values[name]) { notes.push(`${key}: ${name} → ${wants}`); if (apply) setCard(url, item, name, wants); }
      else if (!wants && i.state === "OPEN" && ["Epic", "Task", "Bug"].includes(i.issueType?.name ?? "")) notes.push(`${key}: no ${name}`);
    }
  }
  if (field && p && !own(i) && stored(i) !== p) {
    notes.push(`priority → ${p}`);
    if (apply)
      queue(`${url} priority → ${p}`,
        `setIssueFieldValue(input:{issueId:${JSON.stringify(i.id)},issueFields:[{fieldId:${JSON.stringify(field.id)},singleSelectOptionId:${JSON.stringify(field.options.find((o: { name: string }) => o.name === p).id)}}]})`);
  }
  for (const b of i.blocking.nodes)
    if (i.state === "OPEN" && raises(b) && own(i) && rank.get(own(i)!)! > (rank.get(inherit(b.url) ?? "") ?? Infinity))
      notes.push(`blocks higher: ${b.url}`);
  console.log([url, s, p ?? "—", initiative(url) ?? "—", ...notes].join("\t"));
}
flush();
