import type { PluginOption } from 'vite'
import { FileUtils } from './FileUtils'
import { SvgItem } from './SvgItem'
import { TsConverter } from './TsConverter'

// import { createApp } from 'vue'
// import MyComponent from './components/MyComponent.vue'
// import { setup } from './methods'

const DEFAULT_OPTIONS = {
  base: './resources/js',
  icons: './resources/js/Icons',
  cache: './resources/js/Icons/cache',
  filename: 'icons.ts',
}

export default function vitePluginSvg(options: VitePluginSvgOptions): PluginOption {
  return {
    name: 'vite-plugin-svg',
    async buildStart() {
      const opts: VitePluginSvgOptions = Object.assign({}, DEFAULT_OPTIONS, options)
      console.log(opts)
      console.log('vite-plugin-start')
      console.log(FileUtils.getCachePath())

      await FileUtils.removeDirectory(FileUtils.getCachePath())
      const files = await SvgItem.toList(FileUtils.getDirectoryPath(), FileUtils.getDirectoryPath())
      console.log(files)

      await TsConverter.make(files)
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

interface VitePluginSvgOptions {
  // Add your plugin options here
}
