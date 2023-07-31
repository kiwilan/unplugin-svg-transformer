import { describe, expect, it } from 'vitest'
import { Utils } from '../src/lib/Utils'
import { getPaths } from './methods'

describe('utils', () => {
  // it('can get config', async () => {
  //   const paths = getPaths()
  //   await Writer.make({
  //     iconsDir: paths.iconsDir,
  //     libraryDir: paths.libraryDir,
  //     gitignorePath: paths.gitignorePath,
  //   })
  //   const config = await Utils.getViteConfig()
  //   const iconsFile = await import(config.writer.libraryDir)

  //   const list: Record<string, Promise<{ default: string }>> = iconsFile.IconList

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

    expect(paths.iconsDir).toBe(Utils.normalizePaths(`${process.cwd()}/test/icons`))
    expect(paths.libraryDir).toBe(Utils.normalizePaths(`${process.cwd()}/test/icons/icons.ts`))
    expect(paths.gitignorePath).toBe(Utils.normalizePaths(`${process.cwd()}/test/icons/.gitignore`))
  })

  it('can get package paths', () => {
    const packagePath = Utils.packagePath({ dist: false })
    const componentsPath = Utils.componentsPath()

    const packagePathExpect = Utils.normalizePaths('node_modules/unplugin-svg-transformer')
    const componentsPathExpect = Utils.normalizePaths('node_modules/unplugin-svg-transformer/dist/components.d.ts')

    expect(packagePath.includes(packagePathExpect)).toBe(true)
    expect(componentsPath.includes(componentsPathExpect)).toBe(true)
  })
})
