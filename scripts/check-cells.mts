#!/usr/bin/env node
/* The elegance skill's skeleton gate. `--diff` maps the changed paths of the repository it runs in
 * to their candidate cells and names what needs a second reader.
 *
 * It reads `elegance-mapping.md` at that repository's root as markdown table rows: column 1 a
 * location type from the grid's location key, column 2 its path globs, each in backticks. Every
 * location type needs a row; a row with no globs is a hole; longest matching glob wins. */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

const SKILL = join(import.meta.dirname, "..", "skills", "elegance");

const git = (...args: string[]) => {
  try {
    return execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
  } catch {
    return "";
  }
};
const ROOT = git("rev-parse", "--show-toplevel").trim() || process.cwd();
const DIFF = process.argv.includes("--diff");

const COORDS = ["0", "1", "2", "3", "4", "5"].flatMap((t) => ["A", "B", "C"].map((s) => t + s));

const NAME = /^([0-5][ABC])-([a-z][a-z-]*[a-z])\.md$/;
const RETIRED_SUFFIX = /-(future|current|past)$/;

const TREES: { dir: string; skeleton: string[] }[] = [
  {
    dir: "references/cells",
    skeleton: ["Example", "Location", "Clear when", "Excess", "Cost", "Moves"],
  },
];

/** The map file and its budget. Link targets are not words, so `[label](path)` counts as its label. */
const MAPPING = {
  path: join(ROOT, "elegance-mapping.md"),
  maxWords: 900,
};

const errors: string[] = [];
const err = (where: string, msg: string) => errors.push(`  ERROR  ${where.padEnd(52)} ${msg}`);

/** Every pattern below is written against LF; a Windows checkout hands back CRLF. */
const read = (file: string) => readFileSync(file, "utf8").replace(/\r\n/g, "\n");

/* ---------------------------------------------------------------- the cells */

let cellCount = 0;
const cellLocationClaim = new Map<string, string>();
const cellClear = new Map<string, string>();
for (const tree of TREES) {
  const dir = join(SKILL, tree.dir);
  const files = readdirSync(dir).filter((f) => f.endsWith(".md")).sort();
  const seen = new Map<string, string>();

  for (const name of files) {
    const where = `${tree.dir}/${name}`;
    const m = NAME.exec(name);
    if (!m) {
      err(where, "cell file names are <tier><station>-<name>.md, where <name> is what the cell holds");
      continue;
    }
    if (RETIRED_SUFFIX.test(m[2])) {
      err(where, `${m[2]} ends in a station; a cell is named for what it holds, not for where it sits`);
    }
    const coord = m[1];
    if (seen.has(coord)) err(where, `coordinate ${coord} is also ${seen.get(coord)}`);
    seen.set(coord, name);
    cellCount++;

    const src = read(join(dir, name));
    if (!src.startsWith(`# ${coord} ·`)) err(where, `first line must start "# ${coord} ·"`);
    const headings = [...src.matchAll(/^## (.+)$/gm)].map((h) => h[1].trim());
    if (headings.join("|") !== tree.skeleton.join("|")) {
      err(where, `headings are [${headings.join(", ")}]; the skeleton is [${tree.skeleton.join(", ")}]`);
    }
    cellLocationClaim.set(coord, /## Location\n\n\*\*([^*]+)\*\*/.exec(src)?.[1]?.trim() ?? "");
    const clear = (/## Clear when\n\n([\s\S]*?)(?=\n\n)/.exec(src)?.[1] ?? "").trim();
    cellClear.set(coord, clear);
    if (!clear) err(where, "no Clear when paragraph; --diff has nothing to print for this cell");
    else if (clear.includes("\n")) err(where, "Clear when is one paragraph on one line, so --diff can print it as one lead");
  }
  for (const coord of COORDS) {
    if (!seen.has(coord)) err(tree.dir, `no file for cell ${coord}`);
  }
}

/* ------------------------------------------------------- the reverse index */

/** Table rows of a markdown table, as trimmed columns. */
function rows(src: string): string[][] {
  return src
    .split("\n")
    .filter((l) => l.startsWith("|") && !/^\|[\s|:-]+\|$/.test(l))
    .map((l) => l.replace(/^\||\|$/g, "").split("|").map((c) => c.trim()))
    .filter((r) => !/^-+$/.test(r[0]));
}

const gridSrc = read(join(SKILL, "references", "grid.md"));
const mappingFound = existsSync(MAPPING.path);
const mappingSrc = mappingFound ? read(MAPPING.path) : "";
const mappingName = relative(process.cwd(), MAPPING.path);

const locationOfCell = new Map<string, string>();
for (const row of rows(gridSrc)) {
  for (const col of row.slice(1)) {
    const coord = /\[([0-5][ABC]) /.exec(col)?.[1];
    const tags = [...col.matchAll(/\[([^\]\[]+)\]/g)].map((m) => m[1]);
    const location = tags.at(-1);
    if (coord && location && !location.startsWith(coord)) locationOfCell.set(coord, location);
  }
}
for (const coord of COORDS) {
  if (!locationOfCell.has(coord)) err("references/grid.md", `Table 3 tags no location for cell ${coord}`);
}

const enforcementOfLocation = new Map<string, string>();
for (const [name, value] of rows(gridSrc).map((r) => [r[0], r[1]?.replace(/`/g, "")] as const)) {
  if (["gate", "partial", "described"].includes(value ?? "")) enforcementOfLocation.set(name, value!);
}

const globsOfLocation = new Map<string, string[]>();
for (const row of rows(mappingSrc)) {
  if (!enforcementOfLocation.has(row[0])) continue;
  globsOfLocation.set(row[0], [...(row[1] ?? "").matchAll(/`([^`]+)`/g)].map((m) => m[1]));
}

for (const location of enforcementOfLocation.keys()) {
  if (mappingFound && !globsOfLocation.has(location)) err(mappingName, `no row for location type ${location}`);
}
for (const location of locationOfCell.values()) {
  if (!enforcementOfLocation.has(location)) err("references/grid.md", `Table 3 tags ${location}, absent from the location key`);
}
for (const [coord, claimed] of cellLocationClaim) {
  const tagged = locationOfCell.get(coord);
  if (tagged && claimed && claimed !== tagged) {
    err(`references/cells/${coord}`, `says its location is ${claimed}; Table 3 says ${tagged}`);
  }
}

const unreachable = [...globsOfLocation].filter(([, g]) => !g.length).map(([name]) => name);

/** `**` crosses directories, `*` does not. */
const globRe = (g: string) => {
  const segment = (s: string) => s.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, "[^/]*");
  return new RegExp("^" + g.split("**").map(segment).join(".*") + "$");
};

/** Longest matching glob wins. */
function locationForPath(path: string): string | null {
  let best = -1;
  let location: string | null = null;
  for (const [name, globs] of globsOfLocation) {
    for (const g of globs) {
      if (g.length > best && globRe(g).test(path)) {
        best = g.length;
        location = name;
      }
    }
  }
  return location;
}

const cellsAt = (location: string) => [...locationOfCell].filter(([, l]) => l === location).map(([c]) => c).sort();

const needsReview = (location: string) => enforcementOfLocation.get(location) !== "gate";

/* ---------------------------------------------------------------- the map */

let mapWords = 0;
if (!mappingFound) {
  if (DIFF) err(mappingName, "missing; write the repository's elegance-mapping.md (format atop this script) before --diff");
} else {
  mapWords = mappingSrc.replace(/\]\([^)]*\)/g, "]").split(/\s+/).filter(Boolean).length;
  if (mapWords > MAPPING.maxWords) err(mappingName, `${mapWords} words; a map holds at most ${MAPPING.maxWords}`);
}

/* ---------------------------------------------------------------- the links */

function mdFiles(dir: string, acc: string[] = []): string[] {
  for (const name of readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const path = join(dir, name.name);
    if (name.isDirectory()) mdFiles(path, acc);
    else if (name.name.endsWith(".md")) acc.push(path);
  }
  return acc;
}

const LINK = /\]\(([^)\s]+)\)/g;
let linkCount = 0;
const files = mdFiles(SKILL);
for (const file of files) {
  const where = relative(SKILL, file);
  const src = read(file);
  for (const [, href] of src.matchAll(LINK)) {
    if (/^[a-z]+:/.test(href) || href.startsWith("#")) continue;
    linkCount++;
    const target = resolve(dirname(file), href.split("#")[0]);
    if (!existsSync(target)) err(where, `links ${href}, which does not exist`);
  }
}

/* ------------------------------------------------------------------ --diff */

const defaultBranch = () => git("symbolic-ref", "--short", "refs/remotes/origin/HEAD").trim().replace(/^origin\//, "") || "main";

function changedPaths(): string[] {
  const base = git("merge-base", "HEAD", defaultBranch()).trim();
  const committed = base ? git("diff", "--name-only", base, "HEAD") : "";
  const working = git("status", "--porcelain").replace(/^.{3}/gm, "");
  return [...new Set([...committed.split("\n"), ...working.split("\n")])]
    .map((p) => p.trim().split(" -> ").at(-1)!)
    .filter(Boolean);
}

if (DIFF && mappingFound) {
  const touched = new Map<string, string[]>();
  const unmapped: string[] = [];
  for (const path of changedPaths()) {
    const location = locationForPath(path);
    if (location === null) unmapped.push(path);
    else touched.set(location, [...(touched.get(location) ?? []), path]);
  }

  const cellName = new Map(
    readdirSync(join(SKILL, "references", "cells"))
      .map((f) => NAME.exec(f))
      .filter(Boolean)
      .map((m) => [m![1], m![2].replace(/-/g, " ")]),
  );
  const label = (coord: string) => `${coord} ${cellName.get(coord) ?? ""}`;

  console.log("\nlocations in the working tree, the cells each could be, and what settles them\n");
  for (const location of [...touched.keys()].sort()) {
    const paths = touched.get(location)!;
    console.log(`  ${location.padEnd(18)} ${(enforcementOfLocation.get(location) ?? "?").padEnd(10)} ${paths.length} file(s)`);
    for (const coord of cellsAt(location)) {
      console.log(`      ${label(coord).padEnd(16)} ${cellClear.get(coord) ?? ""}`);
    }
    console.log(
      `      ${"paths".padEnd(16)} ${paths.slice(0, 3).join(", ")}` +
        `${paths.length > 3 ? ` … and ${paths.length - 3} more` : ""}\n`,
    );
  }
  if (unmapped.length) {
    console.log(`\n  in no location, so in no cell: ${unmapped.slice(0, 5).join(", ")}`);
    console.log(`  a path the map cannot place is a hole in ${mappingName}, not a file outside the grid.`);
  }

  const flagged = [...touched.keys()].filter(needsReview).sort();
  if (!touched.size && !unmapped.length) {
    console.log("\nNo paths changed, so this is a reading about nothing rather than a pass.\n");
  } else {
    if (flagged.length) {
      console.log(`Nothing gates ${flagged.join(", ")}. Hand the diff to the elegance-review agent before finishing.`);
    }
    console.log(
      "A gate refuses an incorrect state and nothing anywhere refuses excess, so every cell above is owed a" +
        "\nreader for its Excess section whatever the enforcementOfLocation column says. The station is yours to settle" +
        "\ntoo: the map places a file, not the reason you touched it.\n",
    );
  }
}

/* ---------------------------------------------------------------- report */

for (const line of errors) console.error(line);
if (unreachable.length) console.log(`\n  no path reaches ${unreachable.join(", ")}; --diff can never flag their cells`);
console.log(
  `\n${cellCount} cells · ${files.length} files · ${linkCount} links · ` +
    `${mappingFound ? `map ${mapWords}/${MAPPING.maxWords} words` : "no mapping"} · ${errors.length} error(s)`,
);
process.exit(errors.length ? 1 : 0);
