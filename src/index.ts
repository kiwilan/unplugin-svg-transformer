import { createUnplugin } from 'unplugin'
import type { Options } from './types'
import { Utils } from './lib/Utils'
import { SvgTransformer } from './lib'

const DEFAULT_OPTIONS: Options = {
  iconsDir: './src/svg',
  libraryDir: './src',
  types: true,
  windowInject: true,
  globalType: true,
}

export default createUnplugin<Options | undefined>(options => ({
  name: 'unplugin-svg-transformer',
  async buildStart() {
    const opts = Utils.convertOptions(DEFAULT_OPTIONS, options)

    await SvgTransformer.make(opts)
  },
  vite: {
    handleHotUpdate({ file, server }) {
      if (file.endsWith('.svg'))
        server.restart()

      server.watcher.on('unlink', (path) => {
        if (path.endsWith('.svg'))
          server.restart()
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
