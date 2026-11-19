<!--
  default — title + text-only body that spans the full width
  slots:   default = `# Title` followed by body (bullet list or paragraphs)
  The body block is vertically centered in the space below the title.
-->
<template>
  <div class="slidev-layout basic default">
    <slot />
  </div>
</template>

<style scoped>
.default {
  display: flex;
  flex-direction: column;
  padding: var(--margin-top) var(--margin-x) var(--default-body-bottom);
}
.default :deep(h1 + *) {
  margin-top: auto;
}
.default :deep(> :last-child:not(h1)) {
  margin-bottom: auto;
}
</style>
