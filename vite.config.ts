import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgPlugin from './src'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    vue(),
    svgPlugin({
      // Add your plugin options here
    }),
  ],
  build: {
    rollupOptions: {
      input: './src/main.ts', // Specify the entry point for your application here
    },
  },
})
