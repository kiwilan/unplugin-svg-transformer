import type { Options } from './types'
import unplugin from '.'

const DEFAULT_OPTIONS: Options = {
  iconsDir: './assets/icons',
  cacheDir: './src/icons/cache',
  filenamePath: './src/icons.ts',
  gitignorePath: './.gitignore',
  fileType: 'ts',
}

export default function (options: Options = DEFAULT_OPTIONS, nuxt: any) {
  // install webpack plugin
  nuxt.hook('webpack:config', async (config: any) => {
    config.plugins = config.plugins || []
    config.plugins.unshift(unplugin.webpack(options))
  })

  // install vite plugin
  nuxt.hook('vite:extendConfig', async (config: any) => {
    config.plugins = config.plugins || []
    config.plugins.push(unplugin.vite(options))
  })

  nuxt.hook('builder:watch', async (event: any, path: string) => {
    // if (path.startsWith(`${opts.assetsDir}/svg`))
    //   await Icons.make(opts)
  })
}
