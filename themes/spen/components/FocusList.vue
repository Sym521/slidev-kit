<!--
  <FocusList> — reveals list items one per click.
  The first item is visible from the start; only the newest visible
  item shows its **emphasis** in accent color (see styles/base.css).
-->
<script setup lang="ts">
import type { VNode } from 'vue'
import { cloneVNode, defineComponent, h, isVNode, resolveDirective, useSlots, withDirectives } from 'vue'

const slots = useSlots()

const Inner = defineComponent({
  name: 'FocusListInner',
  render() {
    const click = resolveDirective('click')!
    const withClicks = (node: VNode): VNode => {
      if (typeof node.type !== 'string' || !['ul', 'ol'].includes(node.type) || !Array.isArray(node.children))
        return node
      let i = 0
      const items = (node.children as unknown[]).map((child) => {
        if (!isVNode(child) || child.type !== 'li')
          return child
        const n = i++
        return n === 0 ? child : withDirectives(cloneVNode(child), [[click, n]])
      })
      return h(node.type, node.props, items as VNode[])
    }
    return h('div', { class: 'focus-list' }, (slots.default?.() ?? []).map(withClicks))
  },
})
</script>

<template>
  <Inner />
</template>
