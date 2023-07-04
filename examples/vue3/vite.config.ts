import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svg from 'vite-plugin-svg-transformer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), svg()],
})
