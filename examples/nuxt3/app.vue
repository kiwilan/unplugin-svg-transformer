<script lang="ts" setup>
// import './icons'
// async function downloadIcon() {
//   let svg = await import('./node_modules/unplugin-svg-transformer/cache/download')
//   console.log(svg.default);
// }
// downloadIcon()

let icon: IconType = 'download'

// if (process.client) {
//   console.log(window);
// }

// if (process.client && window.importIcon) {
//   let svg = await window.importIcon('download')
//   console.log(svg.default);
// }
</script>

<template>
  <div>
    <SvgIcon name="vite" />
    <SvgIcon name="vite-2" />
    <SvgIcon name="vite" />
    <!-- <NuxtWelcome /> -->
  </div>
</template>

<style lang="css">
svg {
  height: 3rem !important;
  width: 3rem !important;
  color: black;
  display: inline-block;
}
</style>