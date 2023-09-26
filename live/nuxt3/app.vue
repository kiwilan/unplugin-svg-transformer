<script setup lang="ts">
// import { importIcon } from '#icons'
import { importIcon } from 'unplugin-svg-transformer/icons'

const svg = await importIcon('vite-3')
console.warn(svg.default)
</script>

<template>
  <div>
    <SvgIcon name="download" />
    <SvgIcon name="download" />
    <SvgIcon name="vite-3" />
    <SvgIcon name="vite-3" />
  </div>
</template>

<style lang="css">
svg {
  width: 3rem !important;
  height: 3rem !important;
}
</style>
