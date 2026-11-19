<!--
  figure — one large image / video, centered, nothing else
  props:   image    image path (or)
           video    video path (autoplay, muted, loop)
           credit   optional source text under the media (right-aligned)
           border   true = thin outline (for figures with a white background)
  The slide body (markdown) is ignored except for presenter notes.
-->
<script setup lang="ts">
defineProps<{
  image?: string
  video?: string
  credit?: string
  border?: boolean
}>()
</script>

<template>
  <div class="slidev-layout spen figure">
    <figure class="fig" :class="{ border }">
      <video v-if="video" :src="video" autoplay muted loop playsinline />
      <img v-else-if="image" :src="image" alt="">
      <figcaption v-if="credit" class="credit">{{ credit }}</figcaption>
    </figure>
  </div>
</template>

<style scoped>
.figure {
  display: flex;
  align-items: center;
  justify-content: center;
}
.fig {
  position: relative;
  margin: 0;
  line-height: 0;
}
.fig :is(img, video) {
  display: block;
  max-width: var(--figure-max-width);
  max-height: var(--figure-max-height);
  border-radius: var(--radius-figure);
}
.fig.border :is(img, video) {
  outline: var(--figure-border-width) solid var(--c-figure-border);
  outline-offset: calc(-1 * var(--figure-border-width));
}
.fig figcaption {
  position: absolute;
  right: 0;
  top: calc(100% + var(--credit-gap));
  white-space: nowrap;
  line-height: var(--lh-note);
}
</style>
