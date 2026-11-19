<!--
  outline — agenda / table of contents
  slots:   default = `# Outline` + a numbered list (`1. Item`)
-->
<template>
  <div class="slidev-layout basic outline">
    <slot />
  </div>
</template>

<style scoped>
.outline {
  padding: var(--margin-top) var(--margin-x) 0;
}
.outline :deep(h1) {
  font-size: var(--fs-display);
  line-height: var(--lh-display);
  letter-spacing: var(--ls-display);
}
.outline :deep(ol) {
  position: absolute;
  top: var(--outline-top);
  left: calc(var(--margin-x) + var(--outline-indent));
  right: var(--margin-x);
  list-style: none;
  counter-reset: outline;
}
.outline :deep(ol > li) {
  position: relative;
  padding-left: var(--outline-text-x);
  counter-increment: outline;
  font-size: var(--fs-h1);
  line-height: var(--lh-h1);
  letter-spacing: var(--ls-h1);
  font-weight: var(--fw-bold);
}
.outline :deep(ol > li + li) {
  margin-top: var(--outline-gap);
}
.outline :deep(ol > li::before) {
  content: counter(outline) '.';
  position: absolute;
  left: 0;
  width: var(--outline-num-width);
  text-align: right;
  font-variant-numeric: tabular-nums;
}
</style>
