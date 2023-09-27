import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgTransformer from '../../src/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    svgTransformer({
      // global: true,
    }),
  ],
})
