import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import SvgTransformer from '../src/vite'

export default defineConfig({
  plugins: [
    Inspect(),
    SvgTransformer({
      iconsDir: './icons/svg',
      cacheDir: './icons/cache',
      filenamePath: './icons/icons.ts',
      gitignorePath: './.gitignore',
    }),
  ],
})
