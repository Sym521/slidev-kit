# slidev-kit

Slidev themes, rule / overflow checks and a deck scaffold for Claude-assisted presentations (1920×1080).

- **Themes** — `themes/<name>/` (currently: `spen`, ported from a Figma template)
- **Checks** — `slidev-kit check` (static rules) and `slidev-kit verify` (rendered overflow / overlap + PNG per slide)
- **Scaffold** — `slidev-kit init` creates a deck repository with `CLAUDE.md`, Claude settings and the Slidev skill

## Start a new presentation

```sh
pnpm dlx github:Sym521/slidev-kit init my-talk --theme spen
cd my-talk
git init
pnpm install
pnpm dev        # http://localhost:3030
```

In a deck repository:

| Command | What it does |
|---|---|
| `pnpm dev` | live preview |
| `pnpm check` | static rule check of `slides.md` |
| `pnpm verify` | check + rendered check, PNGs in `exports/verify/` |
| `pnpm export:png` | all click states to `exports/slides/` |
| `pnpm update` | pull the latest theme / tools from GitHub |

A deck depends on two packages from this repository:

```json
"slidev-kit": "github:Sym521/slidev-kit",
"slidev-theme-spen": "github:Sym521/slidev-kit#path:/themes/spen"
```

and selects the theme with `theme: spen` in the headmatter. To pin a release, use
`init --ref v0.1.0` (→ `#v0.1.0` and `#v0.1.0&path:/themes/spen`).

## Repository layout

```
bin/slidev-kit.mjs     CLI (init / check / verify / themes / preview / compare)
tools/                 check-slides, verify-slides, compare (theme-independent)
docs/verify.md         verification loop (all themes)
template/              files copied by `init`
themes/<name>/         pnpm workspace package `slidev-theme-<name>`
  layouts/ components/ styles/ package.json   Slidev theme
  limits.mjs           layout limits + verify hooks used by check / verify
  docs/layouts.md      layout catalogue for Claude (keep in sync with limits.mjs)
  docs/tuning.md       where to tweak design tokens (for humans)
  design/              preview.md, Figma references, compare map (theme dev only, not shipped)
```

## Theme work

```sh
pnpm install
pnpm preview spen     # layout sampler at http://localhost:3030
pnpm compare spen     # Figma vs Slidev images in exports/compare/spen/
```

Adding a new theme: see [docs/new-theme.md](docs/new-theme.md).
