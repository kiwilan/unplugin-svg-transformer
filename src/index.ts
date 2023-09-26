import { createUnplugin } from 'unplugin'
import type { Options } from './types'
import { Path } from './lib/Path'
import { SvgTransformer } from './lib'

const DEFAULT_OPTIONS: Options = {
  iconsDir: './src/svg',
  libraryDir: './src',
  useTypes: true,
  globalTypes: false,
}

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

export default createUnplugin<Options | undefined>(options => ({
  name: 'unplugin-svg-transformer',
  async buildStart() {
    const opts = Path.convertOptions(DEFAULT_OPTIONS, options)
    opts.isTesting = await isTesting()
    await SvgTransformer.make(opts)
  },
  vite: {
    handleHotUpdate({ file, server }) {
      if (file.endsWith('.svg'))
        server.restart()

      server.watcher.on('unlink', (path) => {
        if (path.endsWith('.svg'))
          server.restart()
      })
    },
  },
  rollup: {
    //
  },
  webpack() {
    //
  },
  rspack() {
    //
  },
  esbuild: {
    //
  },
}))
