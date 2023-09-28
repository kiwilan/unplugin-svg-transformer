import { defineConfig } from 'vite'
import SvgTransformer from '../../src/vite'

export default defineConfig({
  plugins: [
    SvgTransformer({
      libraryDir: './',
      // cacheDir: './node_modules/unplugin-svg-transformer/cache',
      cacheDir: './cache',
    }),
  ],
})
