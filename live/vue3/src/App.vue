<script setup lang="ts">
import { ref } from 'vue'
import { VueSvg } from 'unplugin-svg-transformer/vue'
import { importIcon } from 'unplugin-svg-transformer/icons'

const icon = ref<string>()
const importMethod = ref<string>()

function fetchIcon() {
  if (!window.importIcon)
    return

  window.importIcon('vue').then(svg => icon.value = svg.default)
  importIcon('vue').then(svg => importMethod.value = svg.default)
}
fetchIcon()
</script>

<template>
  <div>
    Vue 3
    <div v-html="icon" />
    <div v-html="importMethod" />
    <SvgIcon name="vite-copy" />
    <VueSvg name="vite-copy" />
  </div>
</template>
