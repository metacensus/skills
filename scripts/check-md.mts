#!/usr/bin/env node
/* Markdown prose unwrapper — the standing guard for "one line per paragraph".
 *
 * Prose here is written unwrapped: a paragraph, a bullet, a quoted line is one source line, however
 * long. Editors soft-wrap it; Markdown renders it identically either way. What one-line-per-paragraph
 * buys is the diff: change a sentence and exactly one line changes, instead of the whole paragraph
 * reflowing. Repositories that take this one as a submodule gate on the same rule.
 *
 *   (default)  Rewrite every tracked markdown file in place.
 *   --check    Exit 1 if any tracked markdown file still has wrapped prose. This is the CI gate.
 *
 * The transform is a line state machine, not a parser round-trip: only lines that actually join are
 * rewritten; every other byte is passed through untouched. */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const CHECK = process.argv.includes("--check");

const files = execFileSync("git", ["ls-files", "*.md"], { cwd: ROOT, encoding: "utf8" }).split("\n").filter(Boolean);

/* ---------------------------------------------------------------- line classes */
const BLANK = /^[ \t]*$/;
const FENCE = /^ {0,3}(`{3,}|~{3,})/;
const HEADING = /^ {0,3}#{1,6}(\s|$)/;
/* `---`, `***`, `___`, `- - -`. Tested before BULLET so a rule is never read as a list marker. */
const THEMATIC = /^ {0,3}([-*_])(?:[ \t]*\1){2,}[ \t]*$/;
const SETEXT = /^ {0,3}(-+|=+)[ \t]*$/;
const TABLE = /^ {0,3}\|/;
const QUOTE = /^ {0,3}>/;
const HTML = /^ {0,3}</;
const BULLET = /^ {0,3}[-*+][ \t]+\S/;
const ORDERED = /^ {0,3}(\d{1,9})[.)][ \t]+\S/;
const INDENTED = /^ +\S/;
/* Two trailing spaces or a trailing backslash is a hard line break — meaning, not wrapping. */
const HARD_BREAK = /( {2,}|\\)$/;

const rtrim = (s: string) => s.replace(/[ \t]+$/, "");

/** One-line blocks: they end whatever came before and are emitted exactly as written. */
const standalone = (l: string) =>
  FENCE.test(l) ||
  HEADING.test(l) ||
  THEMATIC.test(l) ||
  SETEXT.test(l) ||
  TABLE.test(l) ||
  QUOTE.test(l) ||
  HTML.test(l);

type Open = { text: string; kind: "para" | "item" };

/** Join the wrapped lines of paragraphs and list items. Sees no fences, frontmatter or quotes —
 *  `block()` peels those off first — so every line here is prose or a one-line block. */
function unwrap(lines: string[], warn: (line: string) => void): string[] {
  const out: string[] = [];
  let open: Open | null = null;
  let inList = false;
  let prevBlank = true;
  const close = () => {
    if (open) out.push(open.text);
    open = null;
  };
  /* Join onto the open line, unless it ends in a hard break — that break is the author's. */
  const absorb = (line: string, kind: "para" | "item") => {
    if (open && !HARD_BREAK.test(open.text)) {
      open.text = `${rtrim(open.text)} ${line.trim()}`;
      return;
    }
    close();
    open = { text: line, kind };
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (BLANK.test(line)) {
      close();
      out.push(line);
      prevBlank = true;
      /* A blank line inside a loose list is not the end of the list. Look past it: only prose that
       * is neither indented nor a marker means the list is over. */
      let j = i + 1;
      while (j < lines.length && BLANK.test(lines[j])) j++;
      const next = j < lines.length ? lines[j] : "";
      if (!(INDENTED.test(next) || BULLET.test(next) || ORDERED.test(next))) inList = false;
      continue;
    }

    if (standalone(line)) {
      close();
      out.push(line);
      inList = false;
      prevBlank = false;
      continue;
    }

    /* Only `1.` may interrupt a paragraph, so a mid-paragraph line opening `2025. By 2022…` is
     * prose, not a list. Inside a list, every number is a sibling item. */
    const ordered = line.match(ORDERED);
    if (BULLET.test(line) || (ordered && (inList || prevBlank || ordered[1] === "1"))) {
      close();
      open = { text: line, kind: "item" };
      inList = true;
      prevBlank = false;
      continue;
    }

    prevBlank = false;

    if (INDENTED.test(line)) {
      /* Indented with nothing open is a code block, not a continuation of anything. */
      if (open) absorb(line, "para");
      else out.push(line);
      continue;
    }

    /* Flush text under a list item is a lazy continuation: Markdown folds it into the item, and
     * that is not the wrapping this pass exists to undo. Leave it as authored and say so. */
    if (open?.kind === "item") {
      close();
      open = { text: line, kind: "item" };
      warn(line);
      continue;
    }

    absorb(line, "para");
  }
  close();
  return out;
}

/** Peel off the regions that are copied verbatim — fenced code and block quotes — and run
 *  everything between them through `unwrap`. Recurses into quotes so their prose unwraps too. */
function block(lines: string[], warn: (line: string) => void): string[] {
  const out: string[] = [];
  let buf: string[] = [];
  const flush = () => {
    if (buf.length) out.push(...unwrap(buf, warn));
    buf = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const fence = lines[i].match(FENCE);
    if (fence) {
      flush();
      const marker = fence[1];
      out.push(lines[i]);
      /* A fence closes on the same character, at least as long. Anything inside is content. */
      const closer = new RegExp(`^ {0,3}${marker[0] === "`" ? "`" : "~"}{${marker.length},}[ \t]*$`);
      while (++i < lines.length) {
        out.push(lines[i]);
        if (closer.test(lines[i])) break;
      }
      continue;
    }

    if (QUOTE.test(lines[i])) {
      flush();
      const quoted: string[] = [];
      while (i < lines.length && QUOTE.test(lines[i])) quoted.push(lines[i++]);
      i--;
      const inner = block(quoted.map((l) => l.replace(/^ {0,3}> ?/, "")), warn);
      /* A bare `>` separates two paragraphs inside the quote; it round-trips as a blank line. */
      out.push(...inner.map((l) => (BLANK.test(l) ? ">" : `> ${l}`)));
      continue;
    }

    buf.push(lines[i]);
  }
  flush();
  return out;
}

function transform(src: string, where: string): { out: string; warnings: string[] } {
  if (src.includes("\r\n") && /(?<!\r)\n/.test(src)) {
    throw new Error(`${where}: mixed LF and CRLF line endings; normalize them before unwrapping.`);
  }
  const warnings: string[] = [];
  const newline = src.match(/\r?\n/)?.[0] ?? "\n";
  const lines = src.split(/\r?\n/);
  const head: string[] = [];
  /* YAML frontmatter is not markdown. Only a `---` on line 1 opens it. */
  if (lines[0] === "---") {
    const end = lines.indexOf("---", 1);
    if (end > 0) head.push(...lines.splice(0, end + 1));
  }
  const body = block(lines, (line) => warnings.push(line));
  return { out: [...head, ...body].join(newline), warnings };
}

/* ---------------------------------------------------------------- run */
const warned: string[] = [];
let changed = 0;

for (const file of files) {
  const path = join(ROOT, file);
  const src = readFileSync(path, "utf8");
  const { out, warnings } = transform(src, file);
  for (const w of warnings) warned.push(`${file}  ${w.trim().slice(0, 60)}`);
  if (out === src) continue;
  changed++;
  if (CHECK) console.error(`  WRAPPED  ${file}`);
  else writeFileSync(path, out);
}

/* Lazy continuations are stable and intentional — they describe lines the pass leaves alone, so
 * they report without gating. */
if (warned.length) {
  console.log(`\n${warned.length} lazy continuation(s) left as authored:`);
  for (const w of warned) console.log(`  ${w}`);
}

if (CHECK) {
  console.log(
    `\n${files.length} files · ${changed} with wrapped prose` +
      (changed ? "\nProse is one line per paragraph here. Run: node scripts/check-md.mts" : ""),
  );
  process.exit(changed ? 1 : 0);
}
console.log(`\n${files.length} files · ${changed} rewritten`);
