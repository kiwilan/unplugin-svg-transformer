import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import SvgTransformer from 'unplugin-svg-transformer/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    SvgTransformer(),
  ],
})
