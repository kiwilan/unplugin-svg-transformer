import type { Options } from './types'
import unplugin from '.'

// import type { Nuxt } from '@nuxt/types'
// import { addComponent, addTemplate, createResolver, defineNuxtModule, extendViteConfig } from '@nuxt/kit'

const DEFAULT_OPTIONS: Options = {
  iconsDir: './assets/icons',
  libraryDir: './src',
  gitignorePath: './.gitignore',
  typescript: true,
  windowInject: true,
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

  // nuxt.hook('builder:watch', async (event: any, path: string) => {
  //   if (path.startsWith(`${opts.assetsDir}/svg`))
  //     await Icons.make(opts)
  // })

  // const resolver = createResolver(import.meta.url)

  // addComponent({
  //   name: options.componentName,
  //   filePath: resolver.resolve('./runtime/component.vue'),
  // })

  // nuxt.options.alias['#svg-transformer-options'] = addTemplate({
  //   filename: 'svg-transformer-options.mjs',
  //   getContents: () => Object.entries(opts)
  //     .map(([key, value]) => `export const ${key} = ${JSON.stringify(value, null, 2)}`)
  //     .join('\n'),
  // }).dst

  // extendViteConfig((config) => {
  //   config.server = config.server || {}
  //   config.server.fs = config.server.fs || {}
  //   config.server.fs.allow = config.server.fs.allow || []
  //   config.server.fs.allow.push('..')
  //   config.server.fs.allow.push('../..')
  // })
}
