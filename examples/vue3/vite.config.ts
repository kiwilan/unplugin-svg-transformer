import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgTransformer from '../../src/vite'
// import svgTransformer from 'unplugin-svg-transformer/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    svgTransformer(),
  ],
})
