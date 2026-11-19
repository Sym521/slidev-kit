// Rendered layout check: starts a Slidev dev server, opens every slide in its
// final click state, measures text in slide coordinates and reports
//   - text outside the slide            (ERROR)
//   - text overlapping other text/media (ERROR)
//   - more rendered lines than allowed  (ERROR)
//   - media that failed to load         (ERROR)
//   - text too close to the bottom edge (WARN)
// and saves one PNG per slide to exports/verify/NN.png for visual review.
//
// Theme-specific selectors come from the theme's limits.mjs (VERIFY).
//
// usage: slidev-kit verify [file=slides.md]
import { spawn } from 'node:child_process'
import { mkdirSync, readFileSync, rmSync } from 'node:fs'
import { createServer } from 'node:net'
import { parse } from '@slidev/parser'
import { chromium } from 'playwright-chromium'
import { loadTheme, slidevCommand, themeDirOf } from './theme.mjs'

const file = process.argv[2] ?? 'slides.md'
const outDir = 'exports/verify'
const W = 1920, H = 1080

const deck = await parse(readFileSync(file, 'utf8'), file)
const { LAYOUTS, VERIFY } = await loadTheme(themeDirOf(deck, file))
const V = {
  textSelector: 'h1, h2, h3, p, li, figcaption',
  pageNumber: null,
  captions: 'figcaption',
  behindText: null,
  bottomSafe: H,
  ...VERIFY,
}
const port = await new Promise(r => { const s = createServer().listen(0, () => { const p = s.address().port; s.close(() => r(p)) }) })

const [node, slidev] = slidevCommand()
const server = spawn(node, [...slidev, file, '--port', String(port), '--open=false'], { stdio: 'ignore', detached: true })
const stop = () => { try { process.kill(-server.pid) } catch {} }
process.on('exit', stop)

async function waitReady() {
  for (let i = 0; i < 120; i++) {
    try { if ((await fetch(`http://localhost:${port}/`)).ok) return } catch {}
    await new Promise(r => setTimeout(r, 500))
  }
  throw new Error('slidev dev server did not start')
}
await waitReady()

rmSync(outDir, { recursive: true, force: true })
mkdirSync(outDir, { recursive: true })
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: W, height: H } })
const issues = []

for (let i = 0; i < deck.slides.length; i++) {
  const no = i + 1
  const fm = deck.slides[i].frontmatter ?? {}
  const layout = fm.layout ?? (i === 0 ? 'cover' : 'default')
  const rule = LAYOUTS[layout] ?? {}

  await page.goto(`http://localhost:${port}/${no}?print=true&clicks=99`, { waitUntil: 'networkidle' })
  const slide = page.locator(`[data-slidev-no="${no}"]`)
  await slide.waitFor()
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(300)

  const found = await slide.evaluate((root, { W, layout, rule, wide, V }) => {
    const base = root.querySelector('.slidev-layout') ?? root
    const box = root.getBoundingClientRect()
    const k = W / box.width
    const toSlide = r => ({ x: (r.left - box.left) * k, y: (r.top - box.top) * k, r: (r.right - box.left) * k, b: (r.bottom - box.top) * k })
    const hit = (a, b) => a.x < b.r - 1 && b.x < a.r - 1 && a.y < b.b - 1 && b.y < a.b - 1
    const out = []

    // text blocks = leaf-ish block elements that contain text
    const els = [...base.querySelectorAll(V.textSelector)].filter(e => e.textContent.trim() && !e.closest('.slidev-vclick-hidden'))
    const pn = V.pageNumber && (root.parentElement?.querySelector(V.pageNumber) ?? document.querySelector(V.pageNumber))
    const blocks = els.map((el) => {
      const range = document.createRange(); range.selectNodeContents(el)
      const rects = [...range.getClientRects()].filter(r => r.width > 1 && r.height > 1).map(toSlide)
      const tops = [...new Set(rects.map(r => Math.round(r.y / 8)))]
      const label = `${el.tagName.toLowerCase()} "${el.textContent.trim().slice(0, 40)}"`
      return { el, rects, lines: tops.length, label }
    })
    if (pn) {
      const range = document.createRange(); range.selectNodeContents(pn)
      blocks.push({ el: pn, rects: [...range.getClientRects()].map(toSlide), lines: 1, label: 'page number' })
    }

    for (const bl of blocks) {
      for (const r of bl.rects) {
        if (r.x < -1 || r.y < -1 || r.r > W + 1 || r.b > 1081) { out.push(['ERROR', `${bl.label} runs outside the slide`]); break }
      }
      const isCredit = V.captions && bl.el.matches?.(V.captions)
      if (bl.el !== pn && !isCredit && bl.rects.some(r => r.b > V.bottomSafe)) out.push(['WARN', `${bl.label} reaches y>${V.bottomSafe} (too close to bottom)`])
    }
    // text vs text (skip nested pairs)
    for (let a = 0; a < blocks.length; a++) for (let b = a + 1; b < blocks.length; b++) {
      const A = blocks[a], B = blocks[b]
      if (A.el.contains(B.el) || B.el.contains(A.el)) continue
      if (A.rects.some(ra => B.rects.some(rb => hit(ra, rb)))) out.push(['ERROR', `${A.label} overlaps ${B.label}`])
    }
    // text vs media (cover bleed images are designed to sit behind the title)
    const media = [...base.querySelectorAll('img, video')]
    for (const m of media) {
      if (m.tagName === 'IMG' && !(m.complete && m.naturalWidth)) out.push(['ERROR', `image not loaded: ${m.getAttribute('src')}`])
      if (m.tagName === 'VIDEO' && m.readyState === 0 && m.networkState === 3) out.push(['ERROR', `video not loaded: ${m.getAttribute('src')}`])
      if (V.behindText && m.matches(V.behindText)) continue
      const mr = toSlide(m.getBoundingClientRect())
      for (const bl of blocks) if (!m.closest('figure')?.contains(bl.el) && bl.rects.some(r => hit(r, mr))) out.push(['ERROR', `${bl.label} overlaps media`])
    }
    // rendered line limits
    const lim = (tag, el) => {
      if (tag === 'h1') return rule.h1
      if (tag === 'h2') return rule.h2
      if (tag === 'li') return el.closest('ol') ? rule.ol : rule.ul
      if (tag === 'p' && !el.closest('li')) return rule.p
    }
    let ulLines = 0
    for (const bl of blocks) {
      const tag = bl.el.tagName?.toLowerCase()
      const l = lim(tag, bl.el)
      if (tag === 'li' && !bl.el.closest('ol')) ulLines += bl.lines
      if (l?.lines && bl.lines > l.lines) out.push(['ERROR', `${bl.label} wraps to ${bl.lines} lines (max ${l.lines})`])
    }
    if (rule.ul?.totalLines && ulLines > rule.ul.totalLines) out.push(['ERROR', `bullets use ${ulLines} lines (max ${rule.ul.totalLines})`])
    return out
  }, { W, layout, rule, wide: !!fm.wide, V })

  for (const [level, msg] of found) issues.push({ no, level, msg })
  await slide.screenshot({ path: `${outDir}/${String(no).padStart(2, '0')}.png` })
}

await browser.close()
stop()

const errors = issues.filter(x => x.level === 'ERROR').length
for (const x of issues) console.log(`${x.level.padEnd(5)} slide ${String(x.no).padStart(2)}: ${x.msg}`)
const flagged = [...new Set(issues.map(x => x.no))]
console.log(`\n${file}: ${deck.slides.length} slides, ${errors} error(s), ${issues.length - errors} warning(s)`)
console.log(`PNGs: ${outDir}/NN.png${flagged.length ? ` — review first: ${flagged.map(n => String(n).padStart(2, '0')).join(', ')}` : ''}`)
process.exit(errors ? 1 : 0)
