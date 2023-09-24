import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import SvgTransformer from 'unplugin-svg-transformer/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    SvgTransformer(),
  ],
})
