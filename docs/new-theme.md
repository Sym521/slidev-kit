# Adding a theme

A theme is a workspace package `themes/<name>/` (package name `slidev-theme-<name>`) that is both a Slidev theme
and a slidev-kit rule set. Decks install it with `github:Sym521/slidev-kit#path:/themes/<name>`.

1. Copy an existing theme as a starting point: `cp -r themes/basic themes/<name>`
   (or start empty — the required files are listed below).
2. Edit `package.json` (`name: slidev-theme-<name>`, `files`, `dependencies` for fonts etc., `slidev.defaults`),
   then `styles/`, `layouts/`, `components/`. Run `pnpm install` at the repo root.
   - Every layout root must have the class `slidev-layout` (verify measures inside it).
   - Keep `<FocusList>` (or an equivalent component) — the deck rules forbid raw `v-click`.
3. Write `limits.mjs`:
   - `LAYOUTS` — one entry per layout: allowed frontmatter `props`, and per block type
     (`h1`, `h2`, `p`, `ul`, `ol`, `credit`) `chars` / `lines` / `items` / `totalLines`. Set `media: true` if the
     layout needs `image:`/`video:`, `noH1: true` if it shows no text.
   - `VERIFY` — selectors for the rendered check: `textSelector`, `pageNumber`, `captions`, `behindText`, `bottomSafe`.
4. Write `docs/layouts.md` — when to use each layout, frontmatter, markdown template, limits. This is what Claude
   reads in deck repositories, so keep its numbers identical to `limits.mjs`.
5. Optional: `design/preview.md` (headmatter `theme: ..`, one slide per layout) with `design/public/` assets,
   plus `design/figma-ref/*.png` + `design/compare-map.json` for `pnpm compare <name>`.
6. Check: `pnpm preview <name>`, then
   `node bin/slidev-kit.mjs init /tmp/x --theme <name> --kit link:$PWD --theme-spec link:$PWD/themes/<name>`
   and run `pnpm install && pnpm verify` there.
7. Commit, tag (`git tag v0.x.0`), push. New decks: `init --theme <name>`; existing decks: `pnpm update`.

Required files: `package.json`, `limits.mjs`, `docs/layouts.md`, `layouts/*.vue`.
