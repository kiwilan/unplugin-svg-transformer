// import type { InlineConfig } from 'vite'
// import type { WatchEvent } from '@nuxt/schema'
// import type { Configuration } from 'webpack'

import { addComponent, addImports, addTemplate, addTypeTemplate, addVitePlugin, addWebpackPlugin, createResolver, defineNuxtModule } from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'
import { name, version } from '../package.json'
import vite from './vite'
import webpack from './webpack'
import type { NuxtOptions, OptionsExtended } from './types'
import { Path } from './lib/Path'

const DEFAULT_OPTIONS: NuxtOptions = {
  svgDir: './assets/svg',
  fallback: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
  warning: true,
}

// https://nuxt.com/docs/guide/going-further/hooks
// https://nuxt.com/docs/api/advanced/hooks#lifecycle-hooks
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
  setup(options, nuxt) {
    const opts: OptionsExtended = options
    opts.isNuxt = true
    opts.nuxtDir = nuxt.options.buildDir

    addVitePlugin(() => vite(opts))
    addWebpackPlugin(() => webpack(opts))

    // nuxt.hook('webpack:config', async (config: Configuration[]) => {
    //   const c: Configuration = {}
    //   c.plugins = c.plugins || []
    //   c.plugins.unshift(unplugin.webpack(opts))
    //   config.push(c)
    // })

    // nuxt.hook('vite:extendConfig', async (config: InlineConfig) => {
    //   config.plugins = config.plugins || []
    //   config.plugins.push(unplugin.vite(opts))
    // })

    // nuxt.hook('build:done', async () => {
    //   unplugin.vite(opts)
    // })

    // nuxt.hook('builder:watch', async (event: WatchEvent, path: string) => {
    //   if (path.endsWith('.svg'))
    //     unplugin.vite(opts)
    // })

    // nuxt.hook('vite:serverCreated', async (viteServer) => {
    //   viteServer.watcher.on('unlink', async (path: string) => {
    //     if (path.endsWith('.svg'))
    //       unplugin.vite(opts)
    //   })
    // })

    nuxtAddon(nuxt, opts)
  },
})

async function nuxtAddon(nuxt: Nuxt, opts: OptionsExtended): Promise<void> {
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
}

async function readTypes(opts: OptionsExtended): Promise<string> {
  const path = `${opts.nuxtDir}/types/icons.d.ts`
  if (!await Path.fileExists(path))
    return ''

  return await Path.read(path)
}
