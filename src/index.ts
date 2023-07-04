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
}

export default function vitePluginSvg(options?: VitePluginSvgOptions): PluginOption {
  return {
    name: 'vite-plugin-svg',
    async buildStart() {
      const opts: VitePluginSvgOptions = Object.assign({}, DEFAULT_OPTIONS, options)
      opts.iconsDir = FileUtils.fullPath(opts.iconsDir)
      opts.cacheDir = FileUtils.fullPath(opts.cacheDir)
      opts.filenamePath = FileUtils.fullPath(opts.filenamePath)

      await FileUtils.checkIfDirectoryExists(opts.iconsDir)
      await FileUtils.checkIfDirectoryExists(opts.cacheDir)
      const dir = opts.filenamePath.substring(0, opts.filenamePath.lastIndexOf('/'))
      await FileUtils.checkIfDirectoryExists(dir)

      await FileUtils.removeDirectory(opts.cacheDir)
      const files = await SvgItem.toList(opts.iconsDir, opts.iconsDir)

      await Promise.all(files.map(async (file) => {
        let path = file.getPath()
        path = `${opts.cacheDir}${path}`
        path = path.replace('.svg', '.ts')

        const dir = path.substring(0, path.lastIndexOf('/'))
        await FileUtils.checkIfDirectoryExists(dir)

        let content = file.getContent()
        content = `export default '${content}'\n`

        await FileUtils.write(path, content)
      }))

      await TsConverter.make(files, opts)
      await FileUtils.addPathToGitignoreIfNotExists(options?.cacheDir)
    },
    handleHotUpdate({ file, server }) {
      if (file.endsWith('.svg'))
        server.restart()
    },
  }
}

export interface VitePluginSvgOptions {
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
}
