import { rm, writeFile } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'
import { Utils } from '../src/lib/Utils'
import { getPaths } from './methods'

describe('utils', () => {
  it('can get the paths', () => {
    const paths = getPaths()

    expect(typeof paths).toBe('object')

    expect(paths.iconsDir).toBe(Utils.normalizePaths(`${process.cwd()}/test/icons`))
    expect(paths.cacheDir).toBe(Utils.normalizePaths(`${process.cwd()}/test/icons/cache`))
    expect(paths.filenamePath).toBe(Utils.normalizePaths(`${process.cwd()}/test/icons/icons.ts`))
    expect(paths.gitignorePath).toBe(Utils.normalizePaths(`${process.cwd()}/test/icons/.gitignore`))
  })

  it('can get package paths', () => {
    const packagePath = Utils.packagePath({ dist: false })
    const componentsPath = Utils.componentsPath()

    expect(packagePath).toBe(Utils.normalizePaths('/Users/ewilan/Workspace/vite-plugin-svg/node_modules/unplugin-svg-transformer'))
    expect(componentsPath).toBe(Utils.normalizePaths('/Users/ewilan/Workspace/vite-plugin-svg/node_modules/unplugin-svg-transformer/dist/components.d.ts'))
  })

  it('can create the gitignore file', async () => {
    // delete `.gitignore` file
    await rm(getPaths().gitignorePath, { force: true })

    // create `.gitignore` file
    await writeFile(getPaths().gitignorePath, '')

    await Utils.ignorePath(getPaths().cacheDir, getPaths().gitignorePath)
    const content = await Utils.read(getPaths().gitignorePath)

    const path = Utils.normalizePaths('/test/icons/cache')
    expect(content).toBe(`\n${path}`)
  })
})
