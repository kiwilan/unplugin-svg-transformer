<script setup lang="ts">
import { importSvg } from 'unplugin-svg-transformer/icons'
import { importSvg as aliasImportIcon } from '#icons'

const svg = await importSvg('vite-3')
console.warn(svg)

const aliasSvg = await aliasImportIcon('vite-3')
console.warn(aliasSvg)
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
