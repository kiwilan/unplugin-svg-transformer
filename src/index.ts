import { createUnplugin } from 'unplugin'
import type { Options } from './types'
import { Utils } from './lib/Utils'
import { Writer } from './lib/Writer'

const DEFAULT_OPTIONS: Options = {
  iconsDir: './src/icons',
  libraryDir: './src',
  gitignorePath: './.gitignore',
  typescript: true,
  windowInject: true,
}

export default createUnplugin<Options | undefined>(options => ({
  name: 'unplugin-svg-transformer',
  async buildStart() {
    const opts = Utils.convertOptions(DEFAULT_OPTIONS, options)

    await Writer.make(opts)
  },
  vite: {
    handleHotUpdate({ file, server }) {
      if (file.endsWith('.svg'))
        server.restart()
    },
  },
  rollup: {
    //
  },
  webpack(compiler) {
    //
  },
  rspack(compiler) {
    //
  },
  esbuild: {
    //
  },
}))
