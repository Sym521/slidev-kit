#!/usr/bin/env node
// slidev-kit CLI — deck checks, theme tooling and new-deck scaffolding.
import { spawnSync } from 'node:child_process'
import { cpSync, existsSync, readdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { basename, join, resolve } from 'node:path'
import { KIT_ROOT, THEMES_DIR, slidevCommand } from '../tools/theme.mjs'

const HELP = `slidev-kit <command>

Deck commands (run in a deck repository):
  check  [file=slides.md]   static rule check (layouts, limits, forbidden syntax)
  verify [file=slides.md]   check + rendered overflow/overlap check, PNGs in exports/verify/

Scaffolding:
  init <dir> [--theme spen] [--ref <git tag/branch>]   create a new deck repository
       (testing: --kit <spec> --theme-spec <spec> override the dependency specifiers)
  themes                    list themes (slidev-kit repository only)

Theme work (run in the slidev-kit repository):
  preview <theme>           live layout sampler of themes/<theme>/design/preview.md
  compare <theme>           Figma vs Slidev images in exports/compare/<theme>/
`

const [cmd, ...args] = process.argv.slice(2)
const themes = () => !existsSync(THEMES_DIR) ? [] : readdirSync(THEMES_DIR, { withFileTypes: true })
  .filter(d => d.isDirectory() && existsSync(join(THEMES_DIR, d.name, 'limits.mjs'))).map(d => d.name)
const tool = (name, a) => spawnSync(process.execPath, [join(KIT_ROOT, 'tools', name), ...a], { stdio: 'inherit' }).status ?? 1
const flag = (name, def) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args.splice(i, 2)[1] : def }

switch (cmd) {
  case 'check':
    process.exit(tool('check-slides.mjs', args))
  case 'verify':
    process.exit(tool('check-slides.mjs', args) || tool('verify-slides.mjs', args))
  case 'compare':
    process.exit(tool('compare.mjs', args))
  case 'themes':
    console.log(themes().join('\n'))
    break
  case 'preview': {
    const t = args[0]
    if (!themes().includes(t)) { console.error(`usage: slidev-kit preview <theme>  (${themes().join(', ')})`); process.exit(1) }
    const [node, slidev] = slidevCommand()
    process.exit(spawnSync(node, [...slidev, join(THEMES_DIR, t, 'design/preview.md'), '--open=false', ...args.slice(1)], { stdio: 'inherit' }).status ?? 1)
  }
  case 'init': {
    const kitPkg = JSON.parse(readFileSync(join(KIT_ROOT, 'package.json'), 'utf8'))
    const theme = flag('theme', 'spen')
    const ref = flag('ref', '')
    const repo = kitPkg.slidevKit.repo
    const kit = flag('kit', `${repo}${ref ? `#${ref}` : ''}`)
    const themeSpec = flag('theme-spec', `${repo}#${ref ? `${ref}&` : ''}path:/themes/${theme}`)
    const dir = args[0]
    if (!dir) { console.error('usage: slidev-kit init <dir> [--theme spen] [--ref v0.1.0]'); process.exit(1) }
    if (themes().length && !themes().includes(theme)) { console.error(`unknown theme "${theme}" (available: ${themes().join(', ')})`); process.exit(1) }
    const out = resolve(dir)
    if (existsSync(out) && readdirSync(out).length) { console.error(`${out} is not empty`); process.exit(1) }

    cpSync(join(KIT_ROOT, 'template'), out, { recursive: true })
    renameSync(join(out, 'gitignore'), join(out, '.gitignore')) // npm/pnpm pack drops .gitignore
    const vars = { THEME: theme, NAME: basename(out) }
    for (const f of ['slides.md', 'CLAUDE.md'])
      writeFileSync(join(out, f), readFileSync(join(out, f), 'utf8').replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k]))
    const pkg = {
      name: basename(out),
      private: true,
      type: 'module',
      packageManager: kitPkg.packageManager,
      scripts: {
        'dev': 'slidev slides.md --open=false',
        'check': 'slidev-kit check',
        'verify': 'slidev-kit verify',
        'export:png': 'slidev export slides.md --format png --with-clicks --output exports/slides',
        'build': 'slidev build slides.md',
      },
      devDependencies: {
        '@slidev/cli': kitPkg.peerDependencies['@slidev/cli'],
        'playwright-chromium': kitPkg.dependencies['playwright-chromium'],
        'slidev-kit': kit,
        [`slidev-theme-${theme}`]: themeSpec,
      },
    }
    writeFileSync(join(out, 'package.json'), `${JSON.stringify(pkg, null, 2)}\n`)
    console.log(`Created ${out} (theme: ${theme})\n\n  cd ${dir}\n  git init\n  pnpm install\n  pnpm dev\n`)
    break
  }
  default:
    console.log(HELP)
    process.exit(cmd && cmd !== 'help' && cmd !== '--help' ? 1 : 0)
}
