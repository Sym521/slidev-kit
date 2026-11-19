<!-- Page number, bottom-right on every slide. Hide per slide with `pageNumber: false`. -->
<template>
  <div v-if="$frontmatter.pageNumber !== false" class="basic-page-number">{{ $page }}</div>
</template>

<style>
.basic-page-number {
  position: absolute;
  top: var(--pn-top);
  right: var(--pn-right);
  font-family: var(--font-sans);
  font-size: var(--fs-body-sm);
  line-height: var(--lh-body-sm);
  letter-spacing: var(--ls-body-sm);
  font-weight: var(--fw-bold);
  color: var(--c-text);
  pointer-events: none;
}
</style>
