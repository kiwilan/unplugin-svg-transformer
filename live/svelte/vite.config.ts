import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import SvgTransformer from 'unplugin-svg-transformer/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    SvgTransformer(),
  ],
})
