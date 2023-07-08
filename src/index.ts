import { createUnplugin } from 'unplugin'
import type { Options } from './types'
import { Utils } from './lib/Utils'
import { Writer } from './lib/Writer'

const DEFAULT_OPTIONS: Options = {
  iconsDir: './src/icons',
  cacheDir: './src/icons/cache',
  filenamePath: './src/icons.ts',
  gitignorePath: './.gitignore',
  typescript: true,
  windowInject: true,
}

export default createUnplugin<Options | undefined>(options => ({
  name: 'unplugin-svg-transformer',
  async buildStart() {
    const opts: Options = Object.assign({}, DEFAULT_OPTIONS, options)
    opts.iconsDir = Utils.fullPath(opts.iconsDir || DEFAULT_OPTIONS.iconsDir!)
    opts.cacheDir = Utils.fullPath(opts.cacheDir || DEFAULT_OPTIONS.cacheDir!)
    opts.filenamePath = Utils.fullPath(opts.filenamePath || DEFAULT_OPTIONS.filenamePath!)
    opts.gitignorePath = Utils.fullPath(opts.gitignorePath || DEFAULT_OPTIONS.gitignorePath!)

    await Writer.make(opts)
  },
  vite: {
    handleHotUpdate({ file, server }) {
      if (file.endsWith('.svg'))
        server.restart()
    },
  },
}))
