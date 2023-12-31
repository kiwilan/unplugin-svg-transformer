import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import SvgTransformer from '../src/vite'

export default defineConfig({
  plugins: [
    Inspect(),
    SvgTransformer({
      svgDir: './svg',
      libraryDir: './',
      global: true,
    }),
  ],
})
