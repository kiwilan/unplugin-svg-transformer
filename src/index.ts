import { createUnplugin } from 'unplugin'
import type { Options } from './types'
import { Utils } from './lib/Utils'
import { SvgTransformer } from './lib'

const DEFAULT_OPTIONS: Options = {
  iconsDir: './src/svg',
  libraryDir: './src',
  types: true,
  globalTypes: false,
}

export default createUnplugin<Options | undefined>(options => ({
  name: 'unplugin-svg-transformer',
  async buildStart() {
    const opts = Utils.convertOptions(DEFAULT_OPTIONS, options)
    await SvgTransformer.make(opts)
  },
  vite: {
    handleHotUpdate({ file, server }) {
      if (file.endsWith('.svg')) {
        console.log(file)
        server.restart()
      }

      server.watcher.on('unlink', (path) => {
        if (path.endsWith('.svg')) {
          console.log(path)
          server.restart()
        }
      })
    },
  },
  rollup: {
    //
  },
  webpack() {
    //
  },
  rspack() {
    //
  },
  esbuild: {
    //
  },
}))
