// Layout rules shared by check-slides.mjs (source) and verify-slides.mjs (rendered).
// Keep in sync with docs/layouts.md (this theme).
//
// chars: max characters (after stripping markdown) · lines: max rendered lines
// items: [min, max] count

export const LAYOUTS = {
  'cover': {
    props: ['image', 'imagePosition', 'credit'],
    h1: { chars: 50, lines: 2 },
    p: { chars: 45, lines: 1, items: [0, 1] },
    credit: { chars: 60 },
  },
  'section': {
    props: ['align', 'gradient'],
    h1: { chars: 50, lines: 2 },
  },
  'outline': {
    props: [],
    h1: { chars: 12, lines: 1 },
    ol: { chars: 40, lines: 1, items: [2, 5] },
  },
  'default': {
    props: [],
    h1: { chars: 40, lines: 1 },
    ul: { chars: 70, lines: 1, items: [2, 5] },
  },
  'image-right': {
    props: ['image', 'video', 'credit', 'wide'],
    media: true,
    h1: { chars: 28, lines: 1 },
    ul: { chars: 80, wideChars: 60, lines: 2, totalLines: 7, items: [1, 5] },
    credit: { chars: 60 },
  },
  'figure': {
    props: ['image', 'video', 'credit', 'border'],
    media: true,
    noH1: true,
    credit: { chars: 80 },
  },
  'side-title': {
    props: [],
    h1: { chars: 20, lines: 2 },
    h2: { chars: 45, lines: 1, items: [2, 3] },
    p: { chars: 60, lines: 1 },
    ol: { totalLines: 14, items: [1, 4] },
  },
}

// Theme hooks for `slidev-kit verify` (rendered check).
//   textSelector: elements measured as text blocks
//   pageNumber:   page-number element (overlap target, exempt from the bottom-edge warning)
//   captions:     selector for credits / captions (exempt from the bottom-edge warning)
//   behindText:   media allowed to sit behind text (no overlap error)
//   bottomSafe:   y (slide px) below which body text triggers a WARN
export const VERIFY = {
  textSelector: 'h1, h2, h3, p, li, figcaption, .cover-credit',
  pageNumber: '.basic-page-number',
  captions: 'figcaption, .cover-credit',
  behindText: '.is-bleed',
  bottomSafe: 1000, // page number starts at 1017
}
