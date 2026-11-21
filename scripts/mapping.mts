#!/usr/bin/env node
/* The one reader of markdown a script takes as data. A script names a section, the table under a
 * `## <section>` heading; its rows are the lines after that table's separator, each cell trimmed and its
 * backticks stripped. A row with a cell beginning with `Hole`, past any emphasis, is undecided: it comes
 * back apart from the rows, and the script takes its schema's default for it and reports it. `—` is an
 * empty cell, whose meaning is the schema's. Nothing outside a named section's table is read. */
import { readFileSync, realpathSync } from "node:fs";

const lines = (text: string) => text.replace(/\r\n/g, "\n").split("\n");

/** The first table under `## <section>`; a later one in the section is not read. */
export function table(text: string, section: string): { rows: string[][]; holes: string[][] } {
  const rows: string[][] = [];
  const holes: string[][] = [];
  const all = lines(text);
  let at = all.indexOf(`## ${section}`) + 1;
  if (!at) return { rows, holes };
  while (at < all.length && !all[at].startsWith("|") && !all[at].startsWith("## ")) at++;
  let body = false;
  for (; at < all.length && all[at].startsWith("|"); at++) {
    if (/^[\s|:-]+$/.test(all[at])) {
      body = true;
      continue;
    }
    if (!body) continue;
    const cells = all[at].replace(/^\||\|$/g, "").split("|").map((c) => c.trim().replaceAll("`", ""));
    (cells.some((c) => c.replace(/^[*_]+/, "").startsWith("Hole")) ? holes : rows).push(cells);
  }
  return { rows, holes };
}

if (process.argv[1] && realpathSync(process.argv[1]) === import.meta.filename) {
  const [arg, path] = process.argv.slice(2);
  if (!arg) {
    console.error("usage: mapping.mts SECTION | --holes [PATH], stdin without PATH");
    process.exit(2);
  }
  const text = readFileSync(path ?? 0, "utf8");
  if (arg !== "--holes") for (const row of table(text, arg).rows) console.log(row.join("\t"));
  else
    for (const section of new Set(lines(text).filter((l) => l.startsWith("## ")).map((l) => l.slice(3))))
      for (const hole of table(text, section).holes) console.log([section, ...hole].join("\t"));
}
