// Static rule check for slides.md (no rendering).
// usage: slidev-kit check [file=slides.md]
// exit 1 when any ERROR is found; WARN is advisory.
import { readFileSync } from 'node:fs'
import { parse } from '@slidev/parser'
import { COMMON_PROPS, FORBIDDEN, HEADMATTER_PROPS } from './rules.mjs'
import { loadTheme, themeDirOf } from './theme.mjs'

const file = process.argv[2] ?? 'slides.md'
const deck = await parse(readFileSync(file, 'utf8'), file)
const { LAYOUTS } = await loadTheme(themeDirOf(deck, file))

const plain = s => s
  .replace(/<!--[\s\S]*?-->/g, '')
  .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
  .replace(/[*_`]/g, '')
  .trim()

// Split slide markdown into simple blocks: h1, h2, ul, ol, p (list items keep continuation lines).
function blocks(md) {
  const out = []
  let last = null
  for (const raw of md.replace(/<!--[\s\S]*?-->/g, '').split('\n')) {
    const line = raw.trimEnd()
    if (!line.trim() || /^\s*<\/?[A-Z][\w-]*>\s*$/.test(line)) { last = null; continue }
    let m
    if ((m = line.match(/^#\s+(.*)/))) out.push(last = { type: 'h1', text: m[1] })
    else if ((m = line.match(/^##\s+(.*)/))) out.push(last = { type: 'h2', text: m[1] })
    else if ((m = line.match(/^\s*[-*+]\s+(.*)/))) out.push(last = { type: 'ul', text: m[1] })
    else if ((m = line.match(/^\s*\d+\.\s+(.*)/))) out.push(last = { type: 'ol', text: m[1] })
    else if (last && (last.type === 'ul' || last.type === 'ol' || last.type === 'p')) last.text += ` ${line.trim()}`
    else out.push(last = { type: 'p', text: line.trim() })
  }
  return out
}

const issues = []
const report = (no, level, msg) => issues.push({ no, level, msg })

deck.slides.forEach((slide, i) => {
  const no = i + 1
  const fm = slide.frontmatter ?? {}
  const layout = fm.layout ?? (i === 0 ? 'cover' : 'default')
  const rule = LAYOUTS[layout]
  const src = slide.content ?? ''
  for (const [re, what] of FORBIDDEN)
    if (re.test(src)) report(no, 'ERROR', `forbidden: ${what}`)

  if (!rule) { report(no, 'ERROR', `unknown layout "${layout}" (allowed: ${Object.keys(LAYOUTS).join(', ')})`); return }

  const allowed = new Set([...COMMON_PROPS, ...rule.props, ...(i === 0 ? HEADMATTER_PROPS : [])])
  for (const k of Object.keys(fm))
    if (!allowed.has(k)) report(no, 'ERROR', `frontmatter "${k}" is not allowed for ${layout}`)

  if (rule.media && !fm.image && !fm.video) report(no, 'ERROR', `${layout} needs image: or video:`)
  if (rule.credit && fm.credit && String(fm.credit).length > rule.credit.chars)
    report(no, 'ERROR', `credit ${String(fm.credit).length} chars > ${rule.credit.chars}`)

  const parts = layout === 'side-title' ? src.split(/^::right::\s*$/m) : [src]
  const bs = parts.flatMap((p, idx) => blocks(p).map(b => ({ ...b, right: idx === 1 })))

  const h1s = bs.filter(b => b.type === 'h1')
  if (rule.noH1) {
    if (bs.length) report(no, 'WARN', `${layout} does not show body text (${bs.length} block(s) ignored)`)
    return
  }
  if (h1s.length !== 1) report(no, 'ERROR', `needs exactly one "# Title" (found ${h1s.length})`)
  if (layout === 'side-title' && !parts[1]) report(no, 'ERROR', 'side-title needs a ::right:: section')

  for (const b of bs) {
    const lim = rule[b.type]
    if (!lim) { report(no, 'ERROR', `${b.type} block not supported in ${layout}: "${plain(b.text).slice(0, 40)}"`); continue }
    const len = plain(b.text).length
    const max = (fm.wide && lim.wideChars) || lim.chars
    if (max && len > max) report(no, 'ERROR', `${b.type} ${len} chars > ${max}: "${plain(b.text).slice(0, 50)}…"`)
    const em = (b.text.match(/\*\*[^*]+\*\*/g) ?? []).length
    if (em > 1 && b.type !== 'h1') report(no, 'WARN', `${em} emphases in one ${b.type} (max 1)`)
  }
  for (const type of ['ul', 'ol', 'h2', 'p']) {
    const items = rule[type]?.items
    if (!items) continue
    const n = bs.filter(b => b.type === type).length
    if (type === 'h2' && n === 0) continue // side-title may use references instead
    if (type === 'ol' && layout === 'side-title' && n === 0) continue
    if (n < items[0] || n > items[1]) report(no, 'ERROR', `${n} ${type} item(s), allowed ${items[0]}–${items[1]}`)
  }
  if (layout === 'section' && fm.align === 'center' && h1s[0] && plain(h1s[0].text).length > 25)
    report(no, 'WARN', 'centered section title > 25 chars (prefer 1 line)')
  if (layout === 'side-title') {
    const refs = bs.filter(b => b.type === 'ol')
    const estLines = refs.reduce((s, b) => s + Math.ceil(plain(b.text).length / 75), 0)
    if (estLines > rule.ol.totalLines) report(no, 'ERROR', `references ≈${estLines} lines > ${rule.ol.totalLines}; split the slide`)
  }
})

const errors = issues.filter(x => x.level === 'ERROR').length
for (const x of issues) console.log(`${x.level.padEnd(5)} slide ${String(x.no).padStart(2)}: ${x.msg}`)
console.log(`\n${file}: ${deck.slides.length} slides, ${errors} error(s), ${issues.length - errors} warning(s)`)
process.exit(errors ? 1 : 0)
