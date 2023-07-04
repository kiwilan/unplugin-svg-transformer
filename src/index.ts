import type { PluginOption } from 'vite'
import { FileUtils } from './FileUtils'
import { SvgItem } from './SvgItem'
import { TsConverter } from './TsConverter'

// import { createApp } from 'vue'
// import MyComponent from './components/MyComponent.vue'

const DEFAULT_OPTIONS = {
  iconsDir: './resources/js/Icons',
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

      await FileUtils.removeDirectory(opts.cacheDir)
      const files = await SvgItem.toList(opts.iconsDir, opts.iconsDir)
      // console.log(files)

      await TsConverter.make(files, opts)
      // let content = await typeContent(files)
      // content += await listContent(files)

      // write(iconTsPath(), content)

      // for (const file of files)
      //   await writeCacheSvgFile(file)

      // await addDefaultSvgToCache()
    },
    handleHotUpdate({ file, server }) {
      if (file.endsWith('.svg'))
        server.restart()
    },
  }
}

export interface VitePluginSvgOptions {
  iconsDir: string
  cacheDir: string
  filenamePath: string
}
