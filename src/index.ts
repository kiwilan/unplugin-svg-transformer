import { createUnplugin } from 'unplugin'
import type { Options } from './types'
import { Utils } from './lib/Utils'
import { Writer } from './lib/Writer'

export const DEFAULT_OPTIONS: Options = {
  iconsDir: './src/icons',
  cacheDir: './src/icons/cache',
  filenamePath: './src/icons.ts',
  gitignorePath: './.gitignore',
}

export default createUnplugin<Options | undefined>(options => ({
  name: 'unplugin-svg-transformer',
  async buildStart() {
    const opts: Options = Object.assign({}, DEFAULT_OPTIONS, options)
    opts.iconsDir = Utils.fullPath(opts.iconsDir)
    opts.cacheDir = Utils.fullPath(opts.cacheDir)
    opts.filenamePath = Utils.fullPath(opts.filenamePath)
    opts.gitignorePath = Utils.fullPath(opts.gitignorePath)

    await Writer.make(opts)
  },
  vite: {
    handleHotUpdate({ file, server }) {
      if (file.endsWith('.svg'))
        server.restart()
    },
  },
}))
