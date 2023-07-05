import { createUnplugin } from 'unplugin'
import type { Options } from './types'
import { Utils } from './lib/Utils'
import { SvgItem } from './lib/SvgItem'
import { ListFile } from './lib/ListFile'
import { DefinitionFile } from './lib/DefinitionFile'

export const DEFAULT_OPTIONS: Options = {
  iconsDir: './src/icons/svg',
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

    await Utils.directoriesExists(opts.iconsDir, opts.cacheDir, opts.filenamePath)

    // Remove the cache directory and create it again.
    await Utils.rmDirectory(opts.cacheDir)

    // Get all SVG files from the icons directory.
    const files = await SvgItem.toList(opts.iconsDir)
    await DefinitionFile.make()

    // Write each SVG file to a TS file into the cache directory.
    await SvgItem.listToTsFiles(files, opts.cacheDir)

    // Create the TS file with the list of icons.
    await ListFile.make(files, opts.iconsDir, opts.cacheDir, opts.filenamePath)

    // Add the cache directory to the .gitignore file.
    await Utils.ignorePath(opts.cacheDir, opts.gitignorePath)
  },
  vite: {
    handleHotUpdate({ file, server }) {
      if (file.endsWith('.svg'))
        server.restart()
    },
  },
}))
