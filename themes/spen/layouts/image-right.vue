<!--
  image-right — title + text on the left, media on the right
  slots:   default = `# Title` + body (use <FocusList> for click-by-click bullets)
  props:   image    image path (or)
           video    video path (autoplay, muted, loop)
           credit   optional source text under the media
           wide     true = larger media, narrower text (for videos / wide figures)
-->
<script setup lang="ts">
defineProps<{
  image?: string
  video?: string
  credit?: string
  wide?: boolean
}>()
</script>

<template>
  <div class="slidev-layout spen image-right" :class="{ wide }">
    <div class="ir-text">
      <slot />
    </div>
    <figure v-if="image || video" class="ir-media">
      <video v-if="video" :src="video" autoplay muted loop playsinline />
      <img v-else :src="image" alt="">
      <figcaption v-if="credit" class="credit">{{ credit }}</figcaption>
    </figure>
  </div>
</template>

<style scoped>
.image-right {
  --_text-width: var(--ir-text-width);
  --_media-x: var(--ir-media-x);
  --_media-width: var(--ir-media-width);
  --_radius: var(--radius-media);
  padding: var(--margin-top) 0 0 var(--margin-x);
}
.image-right.wide {
  --_text-width: var(--ir-wide-text-width);
  --_media-x: var(--ir-wide-media-x);
  --_media-width: var(--ir-wide-media-width);
  --_radius: var(--radius-figure);
}
.ir-text {
  width: var(--_text-width);
}
.ir-text :deep(h1) {
  width: var(--ir-text-width);
}
.ir-text :deep(h1 + *) {
  margin-top: calc(var(--content-top) - var(--margin-top) - var(--fs-h1) * var(--lh-h1));
}
.ir-media {
  position: absolute;
  left: var(--_media-x);
  width: var(--_media-width);
  top: 50%;
  transform: translateY(-50%);
  margin: 0;
}
.ir-media :is(img, video) {
  display: block;
  width: 100%;
  height: auto;
  border-radius: var(--_radius);
}
.ir-media figcaption {
  position: absolute;
  right: 0;
  top: calc(100% + var(--credit-gap));
  white-space: nowrap;
}
</style>
