import { addComponent, addImports, addImportsSources, addTemplate, addTypeTemplate, createResolver, defineNuxtModule } from '@nuxt/kit'
import type { Configuration } from 'webpack'
import type { InlineConfig } from 'vite'
import type { Nuxt, WatchEvent } from '@nuxt/schema'
import { name, version } from '../package.json'
import type { Options } from './types'
import { SvgTransformer } from './lib'
import { Utils } from './lib/Utils'
import unplugin from '.'

export interface ModuleOptions extends Options {
  test?: string
  isNuxt?: boolean
  nuxtBuildDir?: string
  nuxtLibraryDir?: string
}
const DEFAULT_OPTIONS: Options = {
  iconsDir: './assets/svg',
  libraryDir: './', // TODO for Nuxt
  types: true,
  windowInject: true,
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: 'svgTransformer',
    compatibility: {
      nuxt: '^3.0.0',
    },
  },
  defaults: DEFAULT_OPTIONS,
  async setup(options, nuxt) {
    const opts = options

    opts.isNuxt = true
    opts.nuxtBuildDir = nuxt.options.buildDir
    opts.nuxtLibraryDir = nuxt.options.buildDir

    const module = await SvgTransformer.make(opts)

    nuxt.hook('webpack:config', async (config: Configuration[]) => {
      const c: Configuration = {}
      c.plugins = c.plugins || []
      c.plugins.unshift(unplugin.webpack(opts))
      config.push(c)
    })

    nuxt.hook('vite:extendConfig', async (config: InlineConfig) => {
      config.plugins = config.plugins || []
      config.plugins.push(unplugin.vite(opts))
    })

    nuxt.hook('build:done', async () => {
      unplugin.vite(opts)
    })

    nuxt.hook('builder:watch', async (event: WatchEvent, path: string) => {
      if (path.endsWith('.svg'))
        unplugin.vite(opts)
    })

    nuxt.hook('vite:serverCreated', async (viteServer) => {
      viteServer.watcher.on('unlink', async (path: string) => {
        if (path.endsWith('.svg'))
          unplugin.vite(opts)
      })
    })

    const resolver = createResolver(import.meta.url)

    addComponent({
      name: 'SvgIcon',
      filePath: resolver.resolve('./component/VueNuxt.ts'),
    })

    nuxt.options.alias['#svg-transformer-options'] = addTemplate({
      filename: 'svg-transformer-options.mjs',
      getContents: () => Object.entries(options)
        .map(([key, value]) => `export const ${key} = ${JSON.stringify(value, null, 2)}`)
        .join('\n'),
    }).dst

    const path = resolver.resolve(`${opts.nuxtLibraryDir}/icons-library.ts`)
    nuxt.options.alias['#icons'] = path

    addImports({
      from: '#icons',
      name: 'iconList, importIcon',
    })

    addTypeTemplate({
      dst: module.getPaths().definitionPath, // resolver.resolve(`${opts.nuxtLibraryDir}/icons.d.ts`)
      filename: 'icons.d.ts',
      getContents: () => '',
    })
  },
})
