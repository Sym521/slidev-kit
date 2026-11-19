// Figma vs Slidev visual comparison for theme work.
// Exports themes/<theme>/design/preview.md (1x, with clicks) and builds, for each pair in
// themes/<theme>/design/compare-map.json, an image stacked as: Figma / Slidev / overlay
// (overlay: red = only in Slidev, cyan = only in Figma).
// usage: slidev-kit compare <theme>   -> exports/compare/<theme>/NN-name.png
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { chromium } from 'playwright-chromium'
import { THEMES_DIR, slidevCommand } from './theme.mjs'

const theme = process.argv[2]
const design = theme && join(THEMES_DIR, theme, 'design')
if (!design || !existsSync(join(design, 'compare-map.json'))) {
  console.error(`usage: slidev-kit compare <theme>   (needs themes/<theme>/design/compare-map.json)`)
  process.exit(1)
}
const previewOut = resolve('exports/preview', theme)
const compareOut = resolve('exports/compare', theme)

const { pairs } = JSON.parse(readFileSync(join(design, 'compare-map.json'), 'utf8'))
rmSync(previewOut, { recursive: true, force: true })
const [node, slidev] = slidevCommand()
execFileSync(node, [...slidev, 'export', join(design, 'preview.md'), '--format', 'png', '--with-clicks', '--scale', '1', '--output', previewOut], { stdio: 'ignore' })
rmSync(compareOut, { recursive: true, force: true })
mkdirSync(compareOut, { recursive: true })
const enc = f => `data:image/png;base64,${readFileSync(f).toString('base64')}`
const browser = await chromium.launch()
const page = await browser.newPage()
for (const [ref, exp, name] of pairs) {
  const res = await page.evaluate(async ({ A, B }) => {
    const load = async (s) => { const i = new Image(); i.src = s; await i.decode(); return i }
    const [ia, ib] = await Promise.all([load(A), load(B)])
    const W = 1920, H = 1080
    const flat = (img) => { const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, W, H); x.drawImage(img, 0, 0, W, H); return x.getImageData(0, 0, W, H).data }
    const da = flat(ia), db = flat(ib)
    const c = document.createElement('canvas'); c.width = W; c.height = H * 3
    const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, W, H * 3)
    x.drawImage(ia, 0, 0, W, H); x.drawImage(ib, 0, H, W, H)
    const o = x.createImageData(W, H); let diff = 0
    for (let p = 0; p < da.length; p += 4) {
      const la = (da[p] + da[p + 1] + da[p + 2]) / 3, lb = (db[p] + db[p + 1] + db[p + 2]) / 3
      o.data[p] = lb; o.data[p + 1] = la; o.data[p + 2] = la; o.data[p + 3] = 255
      if (Math.abs(la - lb) > 60) diff++
    }
    x.putImageData(o, 0, H * 2)
    x.fillStyle = '#00f'; x.font = 'bold 40px sans-serif'
    x.fillText('FIGMA', 20, 50); x.fillText('SLIDEV', 20, H + 50); x.fillText('OVERLAY (red = Slidev only, cyan = Figma only)', 20, 2 * H + 50)
    return { png: c.toDataURL('image/png').split(',')[1], pct: (100 * diff / (W * H)).toFixed(2) }
  }, { A: enc(join(design, `figma-ref/slide-${ref}.png`)), B: enc(join(previewOut, `${exp}.png`)) })
  const out = join(compareOut, `${ref}-${name}.png`)
  writeFileSync(out, Buffer.from(res.png, 'base64'))
  console.log(`${out}  diff ${res.pct}%`)
}
await browser.close()
