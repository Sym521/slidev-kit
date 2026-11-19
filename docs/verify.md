# Verification loop

Run after every change to `slides.md`, before reporting the work as done.

## 1. Static check — `pnpm check`

Reads `slides.md` only (fast, no browser). Flags:

- unknown layouts, frontmatter keys not allowed for the layout
- forbidden syntax: `style=`, `<style>`, `class=`, raw `v-click`, `{.class}`
- character / item limits from the theme's `docs/layouts.md` (source of truth for numbers: `themes/<theme>/limits.mjs`)
- more than one `**emphasis**` per item (WARN)

Fix every ERROR before continuing.

## 2. Rendered check — `pnpm verify`

Runs the static check, then renders every slide in its **final click state** and measures the real layout:

| Check | Level |
|---|---|
| text outside the 1920×1080 slide | ERROR |
| text overlapping other text, media, or the page number | ERROR |
| a block wraps to more lines than the layout allows | ERROR |
| image / video failed to load (wrong path, file not in `public/`) | ERROR |
| text below y = 1000 (too close to the page number band) | WARN |

It writes one PNG per slide to `exports/verify/NN.png` and prints `review first: …` for slides with findings.

## 3. Visual review (Claude)

1. Open the PNGs of every flagged slide first, then skim all others.
2. Look for what the script cannot judge:
   - awkward line breaks (a single orphan word on the last line)
   - image cropped badly / wrong aspect, unreadable figure text
   - unbalanced slide (body very short next to a large empty area) — consider another layout
   - emphasis on the wrong words, or the deck repeating the same layout too many times in a row
3. Intermediate click states are not in `exports/verify/`. If a slide uses `<FocusList>` and something looks off,
   run `pnpm export:png` and check `exports/slides/NNN-CC.png`.

## 4. Fix and repeat

- Fix only `slides.md` (or add media to `public/`): shorten, split the slide, or switch to a better-fitting layout.
- Never fix overflow by changing sizes, spacing, or adding styles.
- Re-run `pnpm verify` until it reports **0 errors**, and re-review the slides you changed.
- If the content cannot fit any layout, stop and ask the human (a new layout may be needed — that is theme work).

When reporting, state: number of slides, `verify` result (errors / warnings), and which slides were reviewed visually.

---

## For theme work (in the slidev-kit repository)

`pnpm compare <theme>` exports `themes/<theme>/design/preview.md` and writes Figma-vs-Slidev images to
`exports/compare/<theme>/NN-name.png` (Figma / Slidev / overlay: red = only in Slidev, cyan = only in Figma).
Pairs are listed in `themes/<theme>/design/compare-map.json`.
For `basic`: `06`/`07` use a different photo than the sample, so their diff % is high by design — compare the text only.
