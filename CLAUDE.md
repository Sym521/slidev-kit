# CLAUDE.md

slidev-kit: Slidev themes + checks + deck scaffold. Presentations live in **separate repositories** that install
`slidev-kit` (`github:Sym521/slidev-kit`) plus one theme (`github:Sym521/slidev-kit#path:/themes/<name>`);
no deck content belongs here.

## Layout

- `themes/<name>/` — pnpm workspace package `slidev-theme-<name>`, one Slidev theme each (`layouts/`, `components/`, `styles/`), plus `limits.mjs` (rules used by
  the tools) and `docs/layouts.md` (catalogue Claude reads in deck repos). `design/` is theme-dev only.
- `tools/` — theme-independent: `check-slides.mjs`, `verify-slides.mjs`, `compare.mjs`, helpers in `theme.mjs`,
  generic rules in `rules.mjs`. Never hard-code a theme name or theme CSS class in `tools/`; add a hook to `VERIFY`.
- `bin/slidev-kit.mjs` — CLI. `template/` — files copied by `slidev-kit init`.

## Rules

1. Changing a theme's layouts or limits: update `limits.mjs` **and** `docs/layouts.md` together (same numbers).
2. Visual changes to a theme: check with `pnpm preview <theme>` and, if Figma refs exist, `pnpm compare <theme>`.
3. Changes to `tools/` or `template/`: test end-to-end in a scratch deck
   (`node bin/slidev-kit.mjs init <tmp> --kit link:$PWD --theme-spec link:$PWD/themes/basic`,
   then `pnpm install && pnpm verify` there).
4. Deck repos pull updates with `pnpm update`; breaking changes to rules or layout names need a version
   bump in `package.json` and a git tag.
5. Themes must be installed as packages, not referenced by path into `node_modules/`: Vue scoped-style ids break
   when the same file is seen through a pnpm symlink and its real path.
6. pnpm only (`packageManager` is pinned). Build-script approvals go in `pnpm-workspace.yaml` (`allowBuilds`).

## Commands

- `pnpm preview <theme>` — layout sampler (http://localhost:3030)
- `pnpm compare <theme>` — Figma vs Slidev images in `exports/compare/<theme>/`
- `pnpm themes` — list themes
- New theme: `docs/new-theme.md`
