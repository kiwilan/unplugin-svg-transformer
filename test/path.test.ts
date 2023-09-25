import { describe, expect, it } from 'vitest'
import { Path } from '../src/lib/Path'
import { getPaths } from './methods'

describe('utils', () => {
  // it('can get config', async () => {
  //   const paths = getPaths()
  //   await Writer.make({
  //     iconsDir: paths.iconsDir,
  //     libraryDir: paths.libraryDir,
  //     gitignorePath: paths.gitignorePath,
  //   })
  //   const config = await Path.getViteConfig()
  //   const iconsFile = await import(config.writer.libraryDir)

  //   const list: Record<string, Promise<{ default: string }>> = iconsFile.iconList

  //   expect(typeof config).toBe('object')

  //   expect(typeof config.origin.libraryDir).toBe('string')
  //   expect(typeof config.origin.gitignorePath).toBe('string')
  //   expect(typeof config.origin.iconsDir).toBe('string')

  //   expect(typeof config.writer.libraryDir).toBe('string')
  //   expect(typeof config.writer.gitignorePath).toBe('string')
  //   expect(typeof config.writer.iconsDir).toBe('string')

  //   expect(typeof list.download).toBe('object')
  // })

  it('can get the paths', () => {
    const paths = getPaths()

    expect(typeof paths).toBe('object')

    expect(paths.iconsDir).toBe(Path.normalizePaths(`${process.cwd()}/test/icons`))
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
