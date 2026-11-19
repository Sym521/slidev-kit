// Theme-independent rules for slides.md, shared by check and verify.

// Frontmatter keys allowed on every slide / on the first slide (headmatter).
export const COMMON_PROPS = ['layout', 'pageNumber']
export const HEADMATTER_PROPS = ['theme', 'title', 'canvasWidth', 'aspectRatio', 'info', 'author']

// Source patterns that are never allowed in slides.md
export const FORBIDDEN = [
  [/\bstyle\s*=/i, 'inline style="…"'],
  [/<style[\s>]/i, '<style> block'],
  [/\bclass\s*=/i, 'class="…" (utility classes)'],
  [/\bv-clicks?\b/i, 'raw v-click / v-clicks (use <FocusList>)'],
  [/\bv-(motion|mark|after|switch)\b/i, 'Slidev animation directives'],
  [/\{[.#][\w-]+\}/, 'markdown attribute {.class}'],
]
