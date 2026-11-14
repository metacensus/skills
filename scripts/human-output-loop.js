export const meta = {
  name: 'human-output-loop',
  description: 'Cold agents revise a page toward the reader\'s eye: a tiered fact ledger, divergent drafts, rounds of critics and revisions, and a ranker',
  phases: [
    { title: 'Ledger', detail: 'the lens catalog, and the source\'s facts tagged act, detail or context' },
    { title: 'Drafts', detail: 'one writer per organizing idea; the ranker picks one' },
    { title: 'Rounds', detail: 'critics through lenses, a revision each, a fact check each, and a pick' },
  ],
}

const A = args || {}
const ROOT = A.skillRoot
if (!ROOT) throw new Error('args.skillRoot is the human-output skill folder')
const MEDIA = {
  chat: 'a chat reply to a person',
  parallel: 'a page a person reads beside the agent-facing document it renders',
  github: 'an issue or pull request body',
}
const MEDIUM = MEDIA[A.medium]
if (!MEDIUM) throw new Error('args.medium is chat, parallel or github')
if (!A.sourcePath && !A.sourceText) throw new Error('args.sourcePath or args.sourceText is the source')
const SKILL = `${ROOT}/SKILL.md`, REF = `${ROOT}/references/${A.medium}.md`, LENSES = `${ROOT}/references/lenses.md`
const SOURCE = A.sourcePath ? `Source: the document at ${A.sourcePath} (read it).` : `The source:\n<source>\n${A.sourceText}\n</source>`
const N_DRAFTS = A.drafts ?? 4, N_ROUNDS = A.rounds ?? 1, BEAM = A.beam ?? 4, CURATE_ROUNDS = A.curateRounds ?? 0

const CORE = `Wake up. You are not this page's writer. You are the person who has to read it, with little time and attention to spend. Paragraphs spend attention recklessly; the eye takes in layout, marks, position and direction before it reads a word. Summary is the most rudimentary translation for a reader; the better one draws the information so the eye carries it.

Improvement is mostly reorganizing: extract, merge, move, split, collapse, layer, re-project, or draw a view the source only implies. Keep what the reader needs to act, move detail down a layer, and drop what nobody would miss.`

const DOC = { type: 'object', properties: { doc: { type: 'string', description: 'the full page, Markdown' } }, required: ['doc'] }
const CRIT = { type: 'object', properties: { critique: { type: 'string' } }, required: ['critique'] }
const CATALOG = { type: 'object', properties: { ideas: { type: 'array', items: { type: 'string' } }, dimensions: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, values: { type: 'array', items: { type: 'string' } } }, required: ['name', 'values'] } }, curation: { type: 'array', items: { type: 'string' } } }, required: ['ideas', 'dimensions', 'curation'] }
const FACTS = { type: 'object', properties: { facts: { type: 'array', items: { type: 'object', properties: { fact: { type: 'string' }, tier: { type: 'string', enum: ['act', 'detail', 'context'] } }, required: ['fact', 'tier'] } } }, required: ['facts'] }
const MISSING = { type: 'object', properties: { missing: { type: 'array', items: { type: 'number' } } }, required: ['missing'] }
const PICK = { type: 'object', properties: { best: { type: 'string' }, why: { type: 'string' } }, required: ['best', 'why'] }

let seed = A.seed ?? 1
function rnd() { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648 }
function shuffle(a) { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); const t = b[i]; b[i] = b[j]; b[j] = t } return b }
function pickOne(a) { return a[Math.floor(rnd() * a.length)] }

function load(doc) {
  let n = 0, code = false
  for (const l of doc.split('\n')) {
    const s = l.trim()
    if (s.startsWith('```')) { code = !code; continue }
    if (code || s.startsWith('#')) continue
    if (s.startsWith('|')) { for (const c of s.replace(/^\||\|$/g, '').split('|')) { const w = c.split(/\s+/).filter(x => /[A-Za-z]/.test(x)); if (w.length > 5) n += w.length } continue }
    n += s.split(/\s+/).filter(x => /[A-Za-z]/.test(x)).length
  }
  return n
}
function lost(facts, missing) { const t = { act: 0, detail: 0, context: 0 }; for (const i of missing || []) { const f = facts[i - 1]; if (f) t[f.tier]++ } return t }

phase('Ledger')
const [cat, led] = await parallel([
  () => agent(`Read ${LENSES}. Return its organizing ideas, each dimension of its Dimensions table with its values, and its curation lenses, all verbatim.`, { label: 'lens catalog', phase: 'Ledger', model: 'haiku', schema: CATALOG }),
  () => agent(`List every atomic fact a reader could need from this source: one short claim per item, each condition kept with its claim, at most 60 items. Tag each "act" if a reader needs it to act or decide, "detail" if some readers need it, "context" if most readers could do without it.\n\n${SOURCE}`, { label: 'ledger', phase: 'Ledger', model: 'sonnet', schema: FACTS }),
])
if (!cat || !led) throw new Error('the lens catalog or the ledger came back empty')
const FACTS_LIST = led.facts
const LEDGER = `The fact ledger, tagged by what the reader needs: [act] needed to act or decide; [detail] some readers need it, and it can sit lower; [context] it can usually go.\n${FACTS_LIST.map((f, i) => `${i + 1}. [${f.tier}] ${f.fact}`).join('\n')}`

async function check(doc, label, ph) {
  const r = await agent(`For each numbered fact, decide whether the page states it or clearly implies it, with its conditions intact. Return the numbers of the facts that are absent or contradicted.\n\nFacts:\n${FACTS_LIST.map((f, i) => `${i + 1}. ${f.fact}`).join('\n')}\n\n<page>\n${doc}\n</page>`, { label, phase: ph, model: 'haiku', schema: MISSING })
  return r ? r.missing : null
}

async function rank(versions, label, ph) {
  const order = shuffle(versions.map((_, i) => i)).map((vi, k) => ({ vi, id: 'v' + (k + 1) }))
  const block = order.map(({ vi, id }) => { const v = versions[vi], t = lost(FACTS_LIST, v.missing); return `<version id="${id}" reading_load="${load(v.doc)}" lost_act="${t.act}" lost_detail="${t.detail}" lost_context="${t.context}">\n${v.doc}\n</version>` }).join('\n\n')
  const p = await agent(`Below are versions of ${MEDIUM}. Pick the one that best serves a human reader's eyes. Weigh together whether the layout itself carries the information, how much reading it asks (reading_load: prose plus table cells over five words), and what it lost (an act fact costs a lot, a detail fact some, a context fact little). Answer with the id and one line on why.\n\n${block}`, { label, phase: ph, model: 'sonnet', schema: PICK })
  const hit = p && order.find(o => o.id === p.best)
  return { chosen: hit ? hit.vi : 0, why: p ? p.why : 'ranker returned nothing; kept the first version' }
}

phase('Drafts')
const ideas = shuffle(cat.ideas).slice(0, N_DRAFTS)
const drafts = (await parallel(ideas.map((idea, j) => async () => {
  const d = await agent(`You write ${MEDIUM} from scratch. Read the skill ${SKILL} and its reference ${REF} first.\n\n${SOURCE}\n\n${LEDGER}\n\n${CORE}\n\nYour organizing idea: ${idea}. Build the page around it, in whatever forms serve the reader. Return the full page.`, { label: `draft ${j + 1}`, phase: 'Drafts', model: 'sonnet', schema: DOC })
  if (!d) return null
  return { idea, doc: d.doc, missing: await check(d.doc, `draft ${j + 1} check`, 'Drafts') }
}))).filter(Boolean)
if (A.current) drafts.push({ idea: 'the current page', doc: A.current, missing: await check(A.current, 'current page check', 'Drafts') })
if (!drafts.length) throw new Error('every draft came back empty')
const dp = await rank(drafts, 'pick a draft', 'Drafts')
let best = drafts[dp.chosen].doc, bestMissing = drafts[dp.chosen].missing
const history = [{ step: 'drafts', options: drafts.map(d => ({ idea: d.idea, load: load(d.doc), lost: lost(FACTS_LIST, d.missing) })), chosen: drafts[dp.chosen].idea, why: dp.why }]

function critique(lens, blast, curate) {
  const frame = curate ? 'This round curates line by line within the page\'s organization: what stays, what goes, and how it is said.' : 'This round may change the page\'s organization or anything within it.'
  const ask = blast ? `Review through each of these values in turn: ${lens}.\nFor each, what does the reader experience, and what would change it? Then rank your findings, the biggest gain first.` : `Look through this lens:\n${lens}\n\nReturn the one to three changes that would help most, biggest first.`
  return `${CORE}\n\n${frame}\n\n${ask} Be concrete: what to change, and a sketch of what it should look like instead.\n\nThe page is ${MEDIUM}.\n<page>\n${best}\n</page>\n\n${SOURCE}`
}

phase('Rounds')
for (let r = 0; r < N_ROUNDS + CURATE_ROUNDS; r++) {
  const curate = r >= N_ROUNDS
  const plan = Array.from({ length: BEAM }, (_, j) => {
    const blast = j >= Math.ceil(BEAM / 2)
    if (curate) return { blast, model: blast ? 'sonnet' : 'haiku', lens: blast ? cat.curation.join(' · ') : shuffle(cat.curation).slice(0, 2).join('\n') }
    if (blast) { const d = pickOne(cat.dimensions); return { blast, model: 'sonnet', lens: `${d.name}: ${d.values.join(' · ')}` } }
    return { blast, model: 'haiku', lens: shuffle(cat.dimensions).slice(0, 2 + Math.floor(rnd() * 2)).map(d => `${d.name}: ${pickOne(d.values)}`).join('\n') }
  })
  const cands = (await parallel(plan.map((p, j) => async () => {
    const c = await agent(critique(p.lens, p.blast, curate), { label: `r${r + 1}.${j + 1} critic`, phase: 'Rounds', model: p.model, schema: CRIT })
    if (!c) return null
    const v = await agent(`You revise ${MEDIUM}. Read the skill ${SKILL} and its reference ${REF} first.\n\n${SOURCE}\n\n${LEDGER}\n\nCurrent page (reading load ${load(best)}):\n<page>\n${best}\n</page>\n\nA reviewer's critique:\n<critique>\n${c.critique}\n</critique>\n\nRevise the page where the critique serves the reader. Add no fact the source lacks. Return the full page.`, { label: `r${r + 1}.${j + 1} revise`, phase: 'Rounds', model: 'sonnet', schema: DOC })
    if (!v) return null
    return { lens: p.lens, doc: v.doc, missing: await check(v.doc, `r${r + 1}.${j + 1} check`, 'Rounds') }
  }))).filter(Boolean)
  const versions = [{ lens: 'the current page', doc: best, missing: bestMissing }, ...cands]
  const pk = await rank(versions, `r${r + 1} pick`, 'Rounds')
  history.push({ step: `round ${r + 1}${curate ? ' (curation)' : ''}`, options: versions.map(v => ({ lens: v.lens, load: load(v.doc), lost: lost(FACTS_LIST, v.missing) })), chosen: versions[pk.chosen].lens, why: pk.why })
  best = versions[pk.chosen].doc; bestMissing = versions[pk.chosen].missing
  log(`round ${r + 1}: ${pk.chosen === 0 ? 'kept the current page' : 'took a revision'} · reading load ${load(best)}`)
}

return { page: best, readingLoad: load(best), lost: (bestMissing || []).map(i => FACTS_LIST[i - 1]).filter(Boolean), ledger: FACTS_LIST, history }
