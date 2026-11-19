<!--
  cover — title slide
  slots:   default = `# Title` + one paragraph subtitle
  props:   image          optional, shown on the right side
           imagePosition  'bleed' (Figma default: large, runs off the bottom/right edge)
                          | 'fit'  (contained inside the right half, within margins)
           credit         optional image source text (bottom-right)
-->
<script setup lang="ts">
defineProps<{
  image?: string
  imagePosition?: 'bleed' | 'fit'
  credit?: string
}>()
</script>

<template>
  <div class="slidev-layout spen cover">
    <img
      v-if="image"
      :src="image"
      class="cover-image"
      :class="`is-${imagePosition ?? 'bleed'}`"
      alt=""
    >
    <div class="cover-text">
      <slot />
    </div>
    <div v-if="credit" class="cover-credit">{{ credit }}</div>
  </div>
</template>

<style scoped>
.cover-text {
  position: absolute;
  top: var(--cover-title-top);
  left: var(--margin-x);
  width: var(--cover-title-width);
}
.cover-text :deep(h1) {
  font-size: var(--fs-display);
  line-height: var(--lh-display);
  letter-spacing: var(--ls-display);
}
.cover-text :deep(h1 + p) {
  margin-top: var(--gap-title-sub);
}
.cover-image {
  position: absolute;
  object-fit: contain;
}
.cover-image.is-bleed {
  left: var(--cover-image-x);
  top: var(--cover-image-y);
  width: var(--cover-image-size);
  height: var(--cover-image-size);
}
.cover-image.is-fit {
  left: 50%;
  right: var(--margin-x);
  top: var(--margin-x);
  bottom: var(--margin-x);
  width: calc(50% - var(--margin-x));
  height: calc(100% - 2 * var(--margin-x));
}
.cover-credit {
  position: absolute;
  top: var(--cover-credit-top);
  right: var(--cover-credit-right);
  font-size: var(--fs-body-sm);
  line-height: var(--lh-body-sm);
  letter-spacing: var(--ls-body-sm);
  text-align: right;
}
</style>
