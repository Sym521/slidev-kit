// Helpers shared by the CLI tools: locate the deck's theme and the Slidev binary.
import { existsSync, readFileSync, realpathSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

export const KIT_ROOT = resolve(import.meta.dirname, '..')
export const THEMES_DIR = join(KIT_ROOT, 'themes')

// Resolve the theme directory of a deck from its headmatter `theme:` the same way Slidev does:
// a path (./, ../, /) or a package name (`basic` -> slidev-theme-basic / @slidev/theme-basic / basic).
// Package themes resolve to their real path, so this matches what Slidev renders.
export function themeDirOf(deck, file) {
  const theme = deck.headmatter?.theme ?? deck.slides?.[0]?.frontmatter?.theme
  if (!theme) throw new Error(`${file}: headmatter has no "theme:"`)
  let dir
  if (/^[./]/.test(theme)) dir = resolve(dirname(resolve(file)), theme)
  else {
    const req = createRequire(resolve(dirname(resolve(file)), 'package.json'))
    const names = theme.includes('/') || theme.startsWith('@') ? [theme] : [`slidev-theme-${theme}`, `@slidev/theme-${theme}`, theme]
    for (const n of names) { try { dir = realpathSync(dirname(req.resolve(`${n}/package.json`))); break } catch {} }
    if (!dir) throw new Error(`${file}: theme "${theme}" is not installed (tried ${names.join(', ')})`)
  }
  if (!existsSync(join(dir, 'limits.mjs'))) throw new Error(`${file}: ${dir}/limits.mjs not found — is "${theme}" a slidev-kit theme?`)
  return dir
}

// Load a theme's layout limits + verify hooks.
export async function loadTheme(dir) {
  const mod = await import(pathToFileURL(join(dir, 'limits.mjs')).href)
  return { dir, LAYOUTS: mod.LAYOUTS, VERIFY: mod.VERIFY ?? {} }
}

// Command that runs the Slidev CLI installed next to the deck (falls back to the kit's own).
export function slidevCommand() {
  for (const base of [join(process.cwd(), 'package.json'), join(KIT_ROOT, 'package.json')]) {
    try {
      const req = createRequire(base)
      const pkgPath = req.resolve('@slidev/cli/package.json')
      const { bin } = JSON.parse(readFileSync(pkgPath, 'utf8'))
      const rel = typeof bin === 'string' ? bin : bin.slidev
      return [process.execPath, [join(dirname(pkgPath), rel)]]
    } catch {}
  }
  throw new Error('@slidev/cli not found — add it to devDependencies (pnpm add -D @slidev/cli)')
}
