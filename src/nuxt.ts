import { addComponent, addTemplate, createResolver, defineNuxtModule } from '@nuxt/kit'
import type { Configuration } from 'webpack'
import type { InlineConfig } from 'vite'
import type { WatchEvent } from '@nuxt/schema'
import type { Options } from './types'
import { Writer } from './lib/Writer'
import { Utils } from './lib/Utils'
import unplugin from '.'

export interface ModuleOptions extends Options {
  test?: string
}
const DEFAULT_OPTIONS: Options = {
  iconsDir: './assets/icons',
  libraryDir: './src',
  gitignorePath: './.gitignore',
  typescript: true,
  windowInject: true,
}

// export default function (options: Options = DEFAULT_OPTIONS, nuxt: Nuxt) {
export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'unplugin-svg-transformer',
    version: '0.0.1',
    configKey: 'svgTransformer',
    compatibility: {
      nuxt: '^3.0.0',
    },
  },
  defaults: DEFAULT_OPTIONS,
  async setup(options, nuxt) {
    const opts = Utils.convertOptions(DEFAULT_OPTIONS, options)

    nuxt.hook('webpack:config', async (config: Configuration[]) => {
      const c: Configuration = {}
      c.plugins = c.plugins || []
      c.plugins.unshift(unplugin.webpack(options))
      config.push(c)
    })

    nuxt.hook('vite:extendConfig', async (config: InlineConfig) => {
      config.plugins = config.plugins || []
      config.plugins.push(unplugin.vite(options))
    })

    nuxt.hook('builder:watch', async (event: WatchEvent, path: string) => {
      if (path.endsWith('.svg')) {
        await Writer.make({
          ...opts,
        })
      }
    })

    const resolver = createResolver(import.meta.url)

    addComponent({
      name: 'SvgIcon',
      filePath: resolver.resolve('./vue/SvgIcon.ts'),
    })

    nuxt.options.alias['#svg-transformer-options'] = addTemplate({
      filename: 'svg-transformer-options.mjs',
      getContents: () => Object.entries(options)
        .map(([key, value]) => `export const ${key} = ${JSON.stringify(value, null, 2)}`)
        .join('\n'),
    }).dst

  // extendViteConfig((config) => {
  //   config.server = config.server || {}
  //   config.server.fs = config.server.fs || {}
  //   config.server.fs.allow = config.server.fs.allow || []
  //   config.server.fs.allow.push('..')
  //   config.server.fs.allow.push('../..')
  // })
  },
})
