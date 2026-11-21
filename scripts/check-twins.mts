/* This repository's twin rule, checked as a consuming repository's gate checks it on a submodule
 * bump. An AI document is any `.md` under `skills/`, directly in `agents/`, or a `CLAUDE.md` or
 * `AGENTS.md` at any depth; its twin is the same path under `.human/`, `.md` replaced by `.human.md`.
 * Each AI document has a twin, each file under `.human/` twins one, and a twin has no `#` heading and
 * at most a third of its AI document's words.
 *
 * Importing it runs nothing; `check-cells.mts` calls `twinErrors`. */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

/** The plugin root, not the git toplevel: run from a consuming repository, it still checks this tree. */
const ROOT = join(import.meta.dirname, "..");

/** Read raw, as the consuming gate reads. */
const read = (file: string) => readFileSync(join(ROOT, file), "utf8");

/** Words as the consuming gate counts them: frontmatter dropped, the rest split on whitespace. */
const words = (src: string) => src.replace(/^---\n([\s\S]*?)\n---\n/, "").split(/\s+/).filter(Boolean).length;

/** Directories the consuming gate's walk skips, at any depth. */
const SKIP = new Set(["node_modules", "tmp", "temp", "dist", "out", ".next", ".git", ".claude", ".agents"]);

/** Every file under `dir`, as a `/`-separated path from the root. */
function walk(dir: string, acc: string[] = []): string[] {
  if (!existsSync(join(ROOT, dir))) return acc;
  for (const e of readdirSync(join(ROOT, dir), { withFileTypes: true })) {
    const path = dir ? `${dir}/${e.name}` : e.name;
    if (e.isDirectory()) {
      if (!SKIP.has(e.name)) walk(path, acc);
    } else if (e.isFile()) acc.push(path);
  }
  return acc;
}

const twinOf = (ai: string) => `.human/${ai.replace(/\.md$/, ".human.md")}`;

export function twinErrors(): { twins: number; errors: [where: string, msg: string][] } {
  const errors: [string, string][] = [];
  const agents = readdirSync(join(ROOT, "agents")).map((name) => `agents/${name}`);
  const ais = [
    ...new Set([
      ...[...walk("skills"), ...agents].filter((p) => p.endsWith(".md")),
      ...walk("").filter((p) => /(^|\/)(AGENTS|CLAUDE)\.md$/.test(p)),
    ]),
  ].sort();
  const aiOfTwin = new Map(ais.map((ai) => [twinOf(ai), ai]));
  const twins = walk(".human").sort();

  for (const ai of ais) {
    if (!existsSync(join(ROOT, twinOf(ai)))) errors.push([ai, `${ai} has no human twin at ${twinOf(ai)}`]);
  }
  for (const twin of twins) {
    const ai = aiOfTwin.get(twin);
    if (!ai) {
      errors.push([twin, `${twin} is the twin of no AI asset`]);
      continue;
    }
    const src = read(twin);
    if (/^#\s+(.+?)\s*$/m.test(src)) errors.push([twin, `${twin} has a # H1; its page is titled by its path`]);
    const [h, a] = [words(src), words(read(ai))];
    if (3 * h > a) errors.push([twin, `${twin} is ${h} words, over a third of ${ai}'s ${a}`]);
  }
  return { twins: twins.length, errors };
}
