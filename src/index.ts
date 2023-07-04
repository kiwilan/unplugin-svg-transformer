import { createUnplugin } from 'unplugin'
import type { Options } from './types'

const DEFAULT_OPTIONS: Options = {
  iconsDir: './resources/js/Icons/svg',
  cacheDir: './resources/js/Icons/cache',
  filenamePath: './resources/js/icons.ts',
  gitignorePath: './.gitignore',
}

export default createUnplugin<Options | undefined>(options => ({
  name: 'unplugin-svg-transformer',
  async buildStart() {
    const opts: Options = Object.assign({}, DEFAULT_OPTIONS, options)
    // opts.iconsDir = FileUtils.fullPath(opts.iconsDir)
    // opts.cacheDir = FileUtils.fullPath(opts.cacheDir)
    // opts.filenamePath = FileUtils.fullPath(opts.filenamePath)
    // opts.gitignorePath = FileUtils.fullPath(opts.gitignorePath)

    // await FileUtils.checkIfDirectoriesExists(opts.iconsDir, opts.cacheDir, opts.filenamePath)

    // Remove the cache directory and create it again.
    // await FileUtils.removeDirectory(opts.cacheDir)

    // Get all SVG files from the icons directory.
    // const files = await SvgItem.toList(opts.iconsDir, opts.iconsDir)

    // Write each SVG file to a TS file into the cache directory.
    // await FileUtils.writeSvgAsTs(files, opts.cacheDir)

    // Create the TS file with the list of icons.
    // await TsConverter.make(files, opts.iconsDir, opts.cacheDir, opts.filenamePath)

    // Add the cache directory to the .gitignore file.
    // await FileUtils.addPathToGitignoreIfNotExists(opts.cacheDir, opts.gitignorePath)
  },
  transformInclude(id) {
    return id.endsWith('main.ts')
  },
  transform(code) {
    return code.replace('__UNPLUGIN__', `Hello Unplugin! ${options}`)
  },
  // handleHotUpdate({ file, server }) {
  //   if (file.endsWith('.svg'))
  //     server.restart()
  // },
}))
