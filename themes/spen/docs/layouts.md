# Layout catalogue

Limits are for English text (characters incl. spaces). "line" = one rendered line at the layout's font size.
When a limit is exceeded, split or shorten — never change sizes.

## Choosing a layout

| Situation | Layout |
|---|---|
| First slide (title, date, author) | `cover` |
| Opening a section, a big question or one-line statement | `section` |
| Agenda | `outline` |
| Text only: bullets that use the full width | `default` |
| Text + one image/video (the most common content slide) | `image-right` (`wide: true` for videos / wide figures) |
| A figure, chart or video that must be large; no text | `figure` |
| Summary of 2–3 key points, or the reference list | `side-title` |

Rhythm tip: a typical talk is `cover → outline → (section → image-right/default …) × N → side-title (conclusion) → side-title (references)`.

---

## cover

```md
---
layout: cover
image: /hero.png            # optional — omit for text-only cover
imagePosition: bleed        # bleed (large, runs off bottom/right) | fit (inside right half)
credit: https://example.com # optional image source
---

# Talk Title

2026/7/22 | Name
```

| Slot | Limit |
|---|---|
| title | ≤ 50 chars, ≤ 2 lines |
| subtitle (1 paragraph) | ≤ 45 chars, 1 line |
| credit | ≤ 60 chars |

`bleed` expects an image with transparent / white background; photos with a background look better with `fit`.

## section

```md
---
layout: section
# align: center     # optional
# gradient: true    # optional — yellow→red title; use for at most 1–2 slides per deck
---

# Why **touch feedback** is important?
```

| Slot | Limit |
|---|---|
| title | ≤ 50 chars, ≤ 2 lines (with `align: center` prefer ≤ 25, 1 line) |

## outline

```md
---
layout: outline
---

# Outline

1. Background
2. How it works
3. Challenges
```

| Slot | Limit |
|---|---|
| title | ≤ 12 chars (normally just "Outline") |
| items | 2–5 items, each ≤ 40 chars, 1 line |

## default

```md
---
layout: default
---

# Slide Title

- First point
- Second point with **one emphasis**
```

| Slot | Limit |
|---|---|
| title | ≤ 40 chars, 1 line |
| bullets | 2–5 items, each ≤ 70 chars, 1 line |

Use `<FocusList>` around the list for click-by-click reveal.

## image-right

```md
---
layout: image-right
image: /photo.png           # or: video: /clip.mp4
credit: Author, A. (2021).  # optional
# wide: true                # larger media, narrower text column
---

# Slide Title

<FocusList>

- Point one
- Point **two**

</FocusList>
```

| Slot | Normal | `wide: true` |
|---|---|---|
| title | ≤ 28 chars, 1 line | ≤ 28 chars, 1 line |
| bullets | 1–5 items, each ≤ 80 chars (≤ 2 lines) | 1–5 items, each ≤ 60 chars (≤ 2 lines) |
| total bullet lines | ≤ 7 | ≤ 7 |
| credit | ≤ 60 chars | ≤ 60 chars |

Media: any aspect ratio; width is fixed (870 px / 1132 px), height follows. Very tall images (taller than ~4:3 portrait) may hit the title — crop them first.

## figure

```md
---
layout: figure
image: /chart.png           # or: video: /clip.mp4
credit: Author, A. (2021).  # optional
# border: true              # thin outline, for figures with white background
---

<!-- presenter notes only; body text is not shown -->
```

| Slot | Limit |
|---|---|
| credit | ≤ 80 chars |

## side-title

Key points:

```md
---
layout: side-title
---

# Conclusion

::right::

## The **process** of X

Track → Position → Retarget

## The **effects** of X

Improve immersion
```

References:

```md
---
layout: side-title
---

# References

::right::

1. https://example.com/
2. Author, A., & Author, B. (2021). Title. In Proceedings … (pp. 1–10). Publisher.
```

| Slot | Limit |
|---|---|
| title | ≤ 20 chars, ≤ 2 lines |
| key points | 2–3 groups; `##` heading ≤ 45 chars (1 line), text ≤ 60 chars (1 line) |
| references | 1–4 items, total ≤ 14 lines (≈ 75 chars per line) — split into two slides if longer |

Numbers `[1].` are generated automatically; write a normal `1.` list.
When references continue on a second slide, start its list with the next number (e.g. `4.`) —
numbering continues from there (`[4].`, `[5].`, …).

---

## Shared conventions

- Page numbers are automatic. Hide on a slide with `pageNumber: false` in its frontmatter.
- Presenter notes: an HTML comment `<!-- … -->` at the end of the slide.
- Media files go in `public/`; reference as `/file.ext`.
