import { addComponent, addImports, addTemplate, addTypeTemplate, createResolver, defineNuxtModule } from '@nuxt/kit'
import type { Configuration } from 'webpack'
import type { InlineConfig } from 'vite'
import type { WatchEvent } from '@nuxt/schema'
import { name, version } from '../package.json'
import type { NuxtOptions, Options, OptionsExtended } from './types'
import { Path } from './lib/Path'
import unplugin from '.'

const DEFAULT_OPTIONS: Options = {
  svgDir: './assets/svg',
}

async function readTypes(opts: OptionsExtended): Promise<string> {
  const path = `${opts.nuxtDir}/types/icons.d.ts`
  if (!await Path.fileExists(path))
    return ''

  return await Path.read(path)
}

export default defineNuxtModule<NuxtOptions>({
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
    const opts: OptionsExtended = options

    opts.isNuxt = true
    opts.nuxtDir = nuxt.options.buildDir

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

    nuxt.options.alias['#svg-transformer-options'] = addTemplate({
      filename: 'svg-transformer-options.mjs',
      getContents: () => Object.entries(opts)
        .map(([key, value]) => `export const ${key} = ${JSON.stringify(value, null, 2)}`)
        .join('\n'),
    }).dst

    const path = resolver.resolve(`${opts.nuxtDir}/icons.ts`)
    nuxt.options.alias['#icons'] = path

    addComponent({
      name: 'SvgIcon',
      filePath: resolver.resolve('./render/NuxtSvg.ts'),
    })

    addImports({
      from: '#icons',
      name: 'SvgName, svgList, importSvg',
    })

    addTypeTemplate({
      dst: 'types/icons.d.ts', // resolver.resolve(`${opts.nuxtLibraryDir}/icons.d.ts`)
      filename: 'icons.d.ts',
      getContents: async () => await readTypes(opts),
    })
  },
})
