<script setup lang="ts">
import { SvgIcon as VueSvg } from 'unplugin-svg-transformer/vue'
import { ref } from 'vue'

const icon = ref<string>()

async function fetchIcon() {
  icon.value = (await window.importIcon('vue-2')).default
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
