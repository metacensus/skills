/* This repository's twin rule, checked as a consuming repository's gate checks it on a submodule
 * bump. An AI document is any `.md` under `skills/`, or directly in `agents/`; its twin is the same
 * path under `.human/`, `.md` replaced by `.human.md`. Each AI document has a twin, each file under
 * `.human/` twins one, and a twin has no `#` heading and at most a third of its AI document's words.
 *
 * Importing it runs nothing; `check-cells.mts` calls `twinErrors`. */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

/** The plugin root, not the git toplevel: run from a consuming repository, it still checks this tree. */
const ROOT = join(import.meta.dirname, "..");

const read = (file: string) => readFileSync(join(ROOT, file), "utf8").replace(/\r\n/g, "\n");

/** Words as the consuming gate counts them: frontmatter dropped, the rest split on whitespace. */
const words = (src: string) => src.replace(/^---\n([\s\S]*?)\n---\n/, "").split(/\s+/).filter(Boolean).length;

/** Every file under `dir`, relative to the root. */
const walk = (dir: string): string[] =>
  existsSync(join(ROOT, dir))
    ? readdirSync(join(ROOT, dir), { recursive: true, withFileTypes: true })
        .filter((e) => e.isFile())
        .map((e) => join(e.parentPath, e.name).slice(ROOT.length + 1))
    : [];

const twinOf = (ai: string) => join(".human", ai.replace(/\.md$/, ".human.md"));

export function twinErrors(): { twins: number; errors: [where: string, msg: string][] } {
  const errors: [string, string][] = [];
  const ais = [...walk("skills"), ...walk("agents").filter((p) => !p.slice("agents/".length).includes("/"))]
    .filter((p) => p.endsWith(".md"))
    .sort();
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
