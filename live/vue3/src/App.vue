<script setup lang="ts">
import { ref } from 'vue'
import { SvgIcon as VueSvg } from 'unplugin-svg-transformer/vue'
import { iconList, importIcon } from 'unplugin-svg-transformer/icons'

console.warn(iconList)

const icon = ref<string>()
const importMethod = ref<string>()

function fetchIcon() {
  if (!window.importIcon)
    return

  window.importIcon('vue').then(svg => icon.value = svg.default)
  // importIcon('vue').then(svg => importMethod.value = svg.default)

  importIcon('vue-2').then((svg) => {
    console.warn(svg.default)
    importMethod.value = svg.default
  })
}
fetchIcon()
</script>

<template>
  <div>
    Vue 3
    <div v-html="icon" />
    <div v-html="importMethod" />
    <SvgIcon name="vite" />
    <VueSvg name="vite" />
    <SvgIcon name="vue-2" />
    <VueSvg name="vue-2" />
    <!-- <VueSvg name="new-svg" /> -->
  </div>
</template>
