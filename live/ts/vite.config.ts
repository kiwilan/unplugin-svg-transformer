import { defineConfig } from 'vite'
import SvgTransformer from '../../src/vite'

export default defineConfig({
  plugins: [
    SvgTransformer({
      global: true,
    }),
  ],
})
