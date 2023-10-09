import type { UnpluginFactory } from 'unplugin'
import { createUnplugin } from 'unplugin'
import type { PluginOptions } from './types'
import { Path } from './lib/Path'
import { SvgTransformer } from './lib'

const DEFAULT_OPTIONS: PluginOptions = {
  svgDir: './src/svg',
  libraryDir: './src',
  useTypes: true,
  global: false,
  cacheDir: './node_modules/unplugin-svg-transformer/cache',
  fallback: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
  warning: true,
}

export const unpluginFactory: UnpluginFactory<PluginOptions | undefined> = options => ({
  name: 'unplugin-svg-transformer',
  // transformInclude(id) {
  //   return id.endsWith('main.ts')
  // },
  // transform(code) {
  //   return code.replace('__UNPLUGIN__', `Hello Unplugin! ${options}`)
  // },
  async buildStart() {
    const opts = Path.convertOptions(DEFAULT_OPTIONS, options)
    opts.isTesting = await isTesting()
    await SvgTransformer.make(opts)
    process.on('warning', e => console.warn(e.stack))
  },
  vite: {
    handleHotUpdate({ file, server }) {
      if (file.endsWith('.svg'))
        server.restart()
    },
    configureServer(server) {
      function onWatchChange(filepath: string) {
        if (filepath.endsWith('.svg'))
          server.restart()
      }

      server.watcher.on('unlink', onWatchChange)
    },
  },
})

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin

async function isTesting(): Promise<boolean> {
  const packagePath = Path.packagePath({ dist: false })
  const testing = `${packagePath}/LICENSE`

  if (!await Path.fileExists(testing)) {
    const packageJsonLocalPath = `${packagePath}/package.json`
    const distPath = '../../dist'
    const packageJsonPath = '../../package.json'
    if (!await Path.fileExists(distPath))
      return false

    const localDistPath = `${packagePath}/dist`
    await Path.ensureDirectoryExists(localDistPath)
    await Path.copyRecursive(distPath, localDistPath)
    await Path.copy(packageJsonPath, packageJsonLocalPath)

    return true
  }

  return false
}
