<script setup lang="ts">
import { importIcon } from '#icons'

const svg = await importIcon('vite-2')
console.warn(svg.default)
</script>

<template>
  <div>
    <SvgIcon name="download" />
    <SvgIcon name="download" />
    <SvgIcon name="vite-3" />
  </div>
</template>

<style lang="css">
svg {
  width: 3rem !important;
  height: 3rem !important;
}
</style>
