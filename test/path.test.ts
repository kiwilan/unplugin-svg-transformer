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

    expect(typeof paths).toBe('object')

    expect(paths.svgDir).toBe(Path.normalizePaths(`${process.cwd()}/test/icons`))
    expect(paths.libraryDir).toBe(Path.normalizePaths(`${process.cwd()}/test/icons/icons.ts`))
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
})
