import { NuxtConfig } from 'nuxt/schema'

const svgTransformer: NuxtConfig['svgTransformer'] = {
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    // "unplugin-svg-transformer/nuxt",
    '../../src/nuxt',
  ],
  svgTransformer: {
    iconsDir: './assets/icons',
    libraryDir: './',
    gitignorePath: './.gitignore',
    typescript: true,
    windowInject: true,
  },
  devtools: { enabled: true }
})
