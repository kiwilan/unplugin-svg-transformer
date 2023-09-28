<script setup lang="ts">
import { ref } from 'vue'
import { SvgIcon as VueSvg } from '../../../src/vue'
import type { SvgName as SvgTyped } from './icons'
import { importSvg, svgList } from './icons'

const icon = ref<string>()

async function fetchIcon() {
  icon.value = await window.importSvg('vue-2')
}
fetchIcon()

function importMethod(name: SvgTyped) {
  console.warn(svgList)
  importSvg(name).then((svg) => {
    console.warn(svg)
  })
}
importMethod('vue-2')
</script>

<template>
  <div>
    Vue 3
    <div v-html="icon" />
    <VueSvg name="vite" />
    <SvgIcon name="vite" />
    <VueSvg name="vue-2" />
    <SvgIcon name="vue-2" />
  </div>
</template>
