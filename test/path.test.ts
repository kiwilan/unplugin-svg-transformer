import { describe, expect, it } from 'vitest'
import { Path } from '../src/lib/Path'
import { getPaths } from './methods'

describe('utils', () => {
  // it('can get config', async () => {
  //   const paths = getPaths()
  //   await Writer.make({
  //     svgDir: paths.svgDir,
  //     libraryDir: paths.libraryDir,
  //     gitignorePath: paths.gitignorePath,
  //   })
  //   const config = await Path.getViteConfig()
  //   const iconsFile = await import(config.writer.libraryDir)

  //   const list: Record<string, Promise<{ default: string }>> = iconsFile.svgList

  //   expect(typeof config).toBe('object')

  //   expect(typeof config.origin.libraryDir).toBe('string')
  //   expect(typeof config.origin.gitignorePath).toBe('string')
  //   expect(typeof config.origin.svgDir).toBe('string')

  //   expect(typeof config.writer.libraryDir).toBe('string')
  //   expect(typeof config.writer.gitignorePath).toBe('string')
  //   expect(typeof config.writer.svgDir).toBe('string')

  //   expect(typeof list.download).toBe('object')
  // })

  it('can get the paths', () => {
    const paths = getPaths()
    const root = Path.rootPath()

    expect(typeof paths).toBe('object')

    expect(root.endsWith('unplugin-svg-transformer')).toBe(true)
    expect(paths.svgDir).toBe(Path.normalizePaths(`${process.cwd()}/test/icons`))
    expect(paths.libraryDir).toBe(Path.normalizePaths(`${process.cwd()}/test`))
    expect(paths.cacheDir).toBe(Path.normalizePaths(`${process.cwd()}/test/cache`))
    expect(paths.gitignorePath).toBe(Path.normalizePaths(`${process.cwd()}/test/icons/.gitignore`))
  })

  it('can get package paths', () => {
    const packagePath = Path.packagePath({ dist: false })
    const componentsPath = Path.componentsPath('vue.d.ts')

    const packagePathExpect = Path.normalizePaths('node_modules/unplugin-svg-transformer')
    const componentsPathExpect = Path.normalizePaths('node_modules/unplugin-svg-transformer/dist/vue.d.ts')

    expect(packagePath.includes(packagePathExpect)).toBe(true)
    expect(componentsPath.includes(componentsPathExpect)).toBe(true)
  })

  it('can find relative paths', () => {
    const libraryPath1 = '/Users/ewilan/Workspace/vite-plugin-svg/examples/ts/icons.ts'
    const iconPath1 = '/Users/ewilan/Workspace/vite-plugin-svg/examples/ts/cache/download.ts'

    expect(Path.relativePath(libraryPath1, iconPath1)).toBe('./cache/download.ts')

    const libraryPath2 = '/Users/ewilan/Workspace/vite-plugin-svg/examples/ts/src/icons.ts'
    const iconPath2 = '/Users/ewilan/Workspace/vite-plugin-svg/examples/ts/cache/download.ts'

    expect(Path.relativePath(libraryPath2, iconPath2)).toBe('../cache/download.ts')

    const libraryPath3 = '/Users/ewilan/Workspace/vite-plugin-svg/examples/ts/src/icons.ts'
    const iconPath3 = '/Users/ewilan/Workspace/vite-plugin-svg/examples/ts/node_modules/unplugin-svg-transformer/cache/download.ts'

    expect(Path.relativePath(libraryPath3, iconPath3)).toBe('../node_modules/unplugin-svg-transformer/cache/download.ts')
  })
})
