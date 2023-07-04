import type { Options } from './types'
import unplugin, { DEFAULT_OPTIONS } from '.'

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
}
