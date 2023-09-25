<script setup lang="ts">
import {VueSvg} from 'unplugin-svg-transformer/vue'
import { ref } from 'vue'

const icon = ref<string>()

async function fetchIcon() {
  icon.value = (await window.importIcon('download')).default
}
fetchIcon()
</script>

<template>
  <div>
    Vue 3
    <div v-html="icon"></div>
    <VueSvg name="vite" />
    <SvgIcon name="vite" />
    <VueSvg name="vue" />
    <SvgIcon name="vue" />
</div>
</template>
