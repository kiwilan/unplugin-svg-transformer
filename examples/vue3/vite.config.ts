import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import SvgTransformer from '../../src/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    SvgTransformer({
      // iconsDir: './src/icons',
      // libraryDir: './',
      // gitignorePath: './.gitignore',
      // typescript: true,
      // windowInject: true,
    }),
  ],
})
