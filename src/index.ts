import type { PluginOption } from 'vite'
import { FileUtils } from './FileUtils'
import { SvgItem } from './SvgItem'
import { TsConverter } from './TsConverter'

// import { createApp } from 'vue'
// import MyComponent from './components/MyComponent.vue'

const DEFAULT_OPTIONS = {
  iconsDir: './resources/js/Icons/svg',
  cacheDir: './resources/js/Icons/cache',
  filenamePath: './resources/js/icons.ts',
  gitignorePath: './.gitignore',
}

export default function vitePluginSvgTransformer(options?: Options): PluginOption {
  return {
    name: 'vite-plugin-svg-transformer',
    async buildStart() {
      const opts: Options = Object.assign({}, DEFAULT_OPTIONS, options)
      opts.iconsDir = FileUtils.fullPath(opts.iconsDir)
      opts.cacheDir = FileUtils.fullPath(opts.cacheDir)
      opts.filenamePath = FileUtils.fullPath(opts.filenamePath)

      await FileUtils.checkIfDirectoriesExists(opts.iconsDir, opts.cacheDir, opts.filenamePath)

      // Remove the cache directory and create it again.
      await FileUtils.removeDirectory(opts.cacheDir)

      // Get all SVG files from the icons directory.
      const files = await SvgItem.toList(opts.iconsDir, opts.iconsDir)

      // Write each SVG file to a TS file into the cache directory.
      await FileUtils.writeSvgAsTs(files, opts.cacheDir)

      // Create the TS file with the list of icons.
      await TsConverter.make(files, opts.iconsDir, opts.cacheDir, opts.filenamePath)

      // Add the cache directory to the .gitignore file.
      await FileUtils.addPathToGitignoreIfNotExists(options?.cacheDir, options?.gitignorePath)
    },
    handleHotUpdate({ file, server }) {
      if (file.endsWith('.svg'))
        server.restart()
    },
  }
}

export interface Options {
  /**
   * Directory where the SVG files are located.
   *
   * @default './resources/js/Icons/svg'
   */
  iconsDir: string
  /**
   * Directory where the cache files will be created.
   *
   * @default './resources/js/Icons/cache'
   */
  cacheDir: string
  /**
   * File where the types and list of icons will be created.
   *
   * @default './resources/js/icons.ts'
   */
  filenamePath: string
  /**
   * Path to the .gitignore file.
   *
   * @default './.gitignore'
   */
  gitignorePath?: string
}
