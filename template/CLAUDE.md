# CLAUDE.md

Slidev deck built with [slidev-kit](https://github.com/Sym521/slidev-kit), theme **`{{THEME}}`** (1920×1080).

Theme package: `node_modules/slidev-theme-{{THEME}}/` (shortcut below: `THEME`). Tools: `node_modules/slidev-kit/` (`KIT`).

## Scope — what Claude edits

- ✅ `slides.md` — the only deck source Claude edits day to day
- ✅ `public/` — add images / videos referenced from slides (path in slides: `/name.png`)
- ❌ `node_modules/` (theme, tools, docs) — maintained in the slidev-kit repository, never patched here.
  If the theme needs a change, stop and tell the human (it is done in slidev-kit, then `pnpm update`).
- ❌ `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml` — tooling, maintained with the human.

## Hard rules

1. Use only the layouts listed in `THEME/docs/layouts.md`.
   Never use Slidev built-in layouts (`two-cols`, `center`, `image`, …) and never create new layouts/components.
2. No styling in `slides.md`: no `style="…"`, no `<style>` blocks, no utility classes (`class="text-red-500"`, …).
   Emphasis is `**bold**` only. Use at most one emphasis per bullet.
3. Click-by-click bullets: wrap the list in `<FocusList>` (blank lines around the list). No raw `v-click` / `v-clicks`.
4. Respect the character / item limits in the theme's `docs/layouts.md`. If content does not fit, shorten or split the
   slide — do not shrink text or tweak spacing. If no layout fits, stop and ask the human.
5. Keep the headmatter `theme: {{THEME}}` unchanged.

## Workflow (always in this order)

1. **Plan first.** Before touching `slides.md`, present a table: `# | layout | title | content summary | media`.
   Wait for approval.
2. **Write** `slides.md` following the templates in `THEME/docs/layouts.md` (read it before writing).
3. **Verify**: `pnpm verify` → review `exports/verify/*.png` → fix → repeat until 0 errors
   (procedure: `KIT/docs/verify.md`). Report the result and which slides were reviewed.

## Commands

- `pnpm check` — static rule check of `slides.md`
- `pnpm verify` — check + rendered overflow/overlap check, PNG per slide in `exports/verify/`
- `pnpm dev` — live preview of `slides.md` (http://localhost:3030)
- `pnpm export:png` — all click states as PNG to `exports/slides/`
- `pnpm update` — pull the latest theme / tools from GitHub (human decides when)

## References

- `THEME/docs/layouts.md` — layout catalogue: when to use, frontmatter, template, limits (**read before writing slides**)
- `KIT/docs/verify.md` — PNG verification loop
- Slidev syntax in general: `.claude/skills/slidev/` (only features allowed by the rules above)
