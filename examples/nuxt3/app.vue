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
    hey
    <SvgIcon name="vite" class="icon" />
    <!-- <NuxtWelcome /> -->
  </div>
</template>

<style lang="css" scoped>
.icon {
  height: 1rem;
  width: 1rem;
  color: black;
  display: inline-block;
}
</style>