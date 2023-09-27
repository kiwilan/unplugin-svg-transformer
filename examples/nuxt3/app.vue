<script lang="ts" setup>
// import './icons'

const icon: SvgType = 'download'
console.warn(icon)

// if (process.client) {
//   console.log(window);
// }

// if (process.client && window.importSvg) {
//   let svg = await window.importSvg('download')
//   console.log(svg);
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
