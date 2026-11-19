<!--
  side-title — title on the left, content column on the right
  slots:   default = `# Title`
           right   = content. Two patterns:
                     a) key points:  `## Heading` + one line of text, repeated (max 3)
                     b) references:  a numbered list `1. Author (Year). Title...`
                        → rendered as "[1]." in bold, smaller text
-->
<template>
  <div class="slidev-layout spen side-title">
    <div class="st-title">
      <slot />
    </div>
    <div class="st-body">
      <slot name="right" />
    </div>
  </div>
</template>

<style scoped>
.side-title {
  display: flex;
  align-items: center;
  padding: 0 var(--margin-x);
}
.st-title {
  width: var(--st-title-width);
  flex: none;
}
.st-body {
  position: absolute;
  left: var(--st-body-x);
  right: var(--margin-x);
  top: 50%;
  transform: translateY(-50%);
}
.st-body :deep(h2 + p) {
  margin-top: var(--st-gap-heading-body);
}
.st-body :deep(p + h2) {
  margin-top: var(--st-gap-group);
}
/* references — uses the built-in list-item counter so `4.` (ol start) continues numbering */
.st-body :deep(ol) {
  list-style: none;
}
.st-body :deep(ol > li) {
  font-size: var(--fs-body-sm);
  line-height: var(--lh-body-sm);
  letter-spacing: var(--ls-body-sm);
}
.st-body :deep(ol > li + li) {
  margin-top: var(--st-gap-ref);
}
.st-body :deep(ol > li::before) {
  content: '[' counter(list-item) ']. ';
  font-weight: var(--fw-bold);
}
</style>
