import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import svgTransformer from 'unplugin-svg-transformer/vite'

export default defineConfig({
  plugins: [
    Inspect(),
    svgTransformer({
      iconsDir: './svg',
      libraryDir: './',
      gitignorePath: './.gitignore',
      useTypes: false,
      windowInject: true,
    }),
  ],
})
