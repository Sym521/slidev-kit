<!--
  section — section opener / big statement or question
  slots:   default = `# Title` (use **bold** for accent words)
  props:   align     'left' (default) | 'center'
           gradient  true = whole title in the yellow→red accent gradient
-->
<script setup lang="ts">
defineProps<{
  align?: 'left' | 'center'
  gradient?: boolean
}>()
</script>

<template>
  <div class="slidev-layout basic section" :class="[`align-${align ?? 'left'}`, { gradient }]">
    <div class="section-body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.section {
  display: flex;
  align-items: center;
  padding: 0 var(--margin-x);
}
.section.align-center {
  justify-content: center;
  text-align: center;
}
.section-body {
  width: var(--section-width);
}
.section-body :deep(h1) {
  font-size: var(--fs-display);
  line-height: var(--lh-display);
  letter-spacing: var(--ls-display);
}
.gradient .section-body :deep(h1) {
  display: inline-block;
  background: var(--g-accent);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.gradient .section-body :deep(h1 strong) {
  color: inherit;
}
</style>
