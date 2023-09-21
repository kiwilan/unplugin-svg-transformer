<script setup lang="ts">
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
    <SvgIcon name="download" />
  </div>
</template>
