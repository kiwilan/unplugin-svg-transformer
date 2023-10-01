import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgTransformer from '../../src/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    svgTransformer({
      // global: true,
      fallback: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8.45v4M12 21a9 9 0 1 1 0-18a9 9 0 0 1 0 18Zm.05-5.55v.1h-.1v-.1h.1Z"/></svg>',
      svg: {
        title: true,
        classDefault: ['svg-icon'],
        clearClass: 'all',
        clearSize: 'all',
        clearStyle: 'all',
        currentColor: true,
        inlineStyleDefault: ['display: inline-block; vertical-align: middle;'],
        sizeInherit: true,
      },
    }),
  ],
})
