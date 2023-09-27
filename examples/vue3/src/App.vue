<script setup lang="ts">
import { ref } from 'vue'
import { SvgIcon as VueSvg } from '../../../src/vue'

const icon = ref<string>()

async function fetchIcon() {
  icon.value = await window.importSvg('vue-2')
}
fetchIcon()
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
