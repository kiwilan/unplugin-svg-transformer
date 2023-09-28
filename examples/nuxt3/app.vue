<script lang="ts" setup>
import type { SvgName as SvgNameAlt } from '#icons'
import { importSvg, svgList } from '#icons'

const icon: SvgName = 'download'
const iconAlt: SvgNameAlt = 'download'

const svg = ref<string>('')

svg.value = await importSvg('download')
console.warn(svgList)
</script>

<template>
  <div>
    <div class="svg" v-html="svg" />
    <SvgIcon :name="icon" class="svg" />
    <SvgIcon :name="iconAlt" class="svg" />
    <SvgIcon name="vite-2" class="svg" />
    <SvgIcon name="vite" class="svg" />
  </div>
</template>

<style lang="css">
.svg {
  height: 2rem !important;
  width: 2rem !important;
  color: black;
  display: inline-block;
}
</style>
