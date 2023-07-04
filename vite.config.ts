import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

export default defineConfig({
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src'),
    },
  },
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      entryRoot: resolve(__dirname, 'src/components'),
    }),
  ],
  build: {
    outDir: 'dist/vue',
    lib: {
      entry: resolve(__dirname, 'src/components/index.ts'),
      name: 'UnpluginSvgTransformer',
      formats: ['es', 'cjs'],
      fileName: format => `vue.${format}.js`,
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
      // external: ['react', 'react-dom', 'styled-components'],
      // output: {
      //   globals: {
      //     'react': 'React',
      //     'react-dom': 'ReactDOM',
      //     'styled-components': 'styled',
      //   },
      // },
    },
  },
})
