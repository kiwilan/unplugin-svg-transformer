<script setup lang="ts">
import { importIcon } from 'unplugin-svg-transformer/icons'
import { importIcon as aliasImportIcon } from '#icons'

const svg = await importIcon('vite-3')
console.warn(svg.default)

const aliasSvg = await aliasImportIcon('vite-3')
console.warn(aliasSvg.default)
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
