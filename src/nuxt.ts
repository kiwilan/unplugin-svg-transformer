import { addComponent, addImports, addTemplate, createResolver, defineNuxtModule } from '@nuxt/kit'
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
}
const DEFAULT_OPTIONS: Options = {
  iconsDir: './assets/svg',
  // libraryDir: './', // TODO for Nuxt
  types: true,
  windowInject: true,
}

async function build(opts: ModuleOptions, nuxt: Nuxt): Promise<void> {
  // const transformer = await SvgTransformer.make(opts)
  // const buildDir = nuxt.options.buildDir

  // const iconsDir = `${buildDir}/icons`
  // await Utils.rmDirectory(iconsDir)
  // await Utils.ensureDirectoryExists(iconsDir)

  // await transformer.writeIconFiles(iconsDir)
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
    const opts: ModuleOptions = Utils.convertOptions(DEFAULT_OPTIONS, options)
    opts.isNuxt = true
    opts.nuxtBuildDir = nuxt.options.buildDir
    opts.libraryDir = nuxt.options.buildDir

    nuxt.hook('webpack:config', async (config: Configuration[]) => {
      const c: Configuration = {}
      c.plugins = c.plugins || []
      c.plugins.unshift(unplugin.webpack(options))
      config.push(c)
    })

    nuxt.hook('vite:extendConfig', async (config: InlineConfig) => {
      config.plugins = config.plugins || []
      config.plugins.push(unplugin.vite(opts))
    })

    nuxt.hook('build:done', async () => {
      await build(opts, nuxt)
    })

    nuxt.hook('builder:watch', async (event: WatchEvent, path: string) => {
      if (path.endsWith('.svg'))
        await build(opts, nuxt)
    })

    nuxt.hook('vite:serverCreated', async (viteServer) => {
      viteServer.watcher.on('unlink', async (path: string) => {
        if (path.endsWith('.svg'))
          await build(opts, nuxt)
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

    const path = resolver.resolve(`${opts.libraryDir}/icons.ts`)
    nuxt.options.alias['#icons'] = path

    addImports({
      from: '#icons',
      name: 'icons',
    })
  },
})
