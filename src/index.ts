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
    const opts: Options = Object.assign({}, DEFAULT_OPTIONS, options)
    opts.iconsDir = Utils.fullPath(opts.iconsDir || DEFAULT_OPTIONS.iconsDir!)
    opts.libraryDir = Utils.fullPath(opts.libraryDir || DEFAULT_OPTIONS.libraryDir!)
    opts.gitignorePath = Utils.fullPath(opts.gitignorePath || DEFAULT_OPTIONS.gitignorePath!)

    const nodeModulesDir = await Utils.findNodeModules()

    await Writer.make({
      ...opts,
      nodeModulesDir,
    })
  },
  vite: {
    handleHotUpdate({ file, server }) {
      if (file.endsWith('.svg'))
        server.restart()
    },
  },
}))
