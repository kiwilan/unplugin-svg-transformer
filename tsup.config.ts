import type { Options } from 'tsup'

export default <Options>{
  entryPoints: [
    'src/*.ts',
  ],
  clean: true,
  // minify: true,
  minify: false,
  format: ['cjs', 'esm'],
  dts: true,
  onSuccess: 'npm run build:fix',
  external: [
    'vue',
    'react',
    'svelte',
    'nuxt',
    '@nuxt/kit',
  ],
}
