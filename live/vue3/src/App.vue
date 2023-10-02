<script setup lang="ts">
import { ref } from 'vue'
import { SvgIcon as VueSvg } from 'unplugin-svg-transformer/vue'
import { importSvg, svgList } from 'unplugin-svg-transformer/icons'

console.warn(svgList)

const icon = ref<string>()
const importMethod = ref<string>()

function fetchIcon() {
  if (!window.importSvg)
    return

  window.importSvg('vue').then(svg => icon.value = svg)
  importSvg('vue').then(svg => importMethod.value = svg)

  importSvg('vue-2').then((svg) => {
    console.warn(svg)
    importMethod.value = svg
  })
}
fetchIcon()
</script>

<template>
  <div>
    Vue 3
    <div v-html="icon" />
    <div v-html="importMethod" />
    <SvgIcon name="vite" reactive />
    <VueSvg name="vite" />
    <SvgIcon name="vue-2" />
    <VueSvg name="vue-2" />
    <!-- <VueSvg name="new-svg" /> -->
  </div>
</template>
