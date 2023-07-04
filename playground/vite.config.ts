import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import Unplugin from '../src/vite'

export default defineConfig({
  plugins: [
    Inspect(),
    Unplugin({
      iconsDir: './icons/svg',
      cacheDir: './icons/cache',
      filenamePath: './icons/icons.ts',
      gitignorePath: './.gitignore',
    }),
  ],
})
