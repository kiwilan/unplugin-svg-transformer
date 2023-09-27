import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import SvgTransformer from '../../src/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    SvgTransformer({
      // svgDir: './src/icons',
      // libraryDir: './',
      // gitignorePath: './.gitignore',
      // typescript: true,
      // windowInject: true,
    }),
  ],
})
