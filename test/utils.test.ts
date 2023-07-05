import { rm, writeFile } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'
import { Utils } from '../src/lib/Utils'
import { getPaths } from './methods'

describe('utils', () => {
  it('can get the paths', () => {
    const paths = getPaths()

    if (process.platform === 'win32') {
      expect(paths.iconsDir).toBe(`${process.cwd()}\\test\\icons\\svg`)
      expect(paths.cacheDir).toBe(`${process.cwd()}\\test\\icons\\cache`)
      expect(paths.filenamePath).toBe(`${process.cwd()}\\test\\icons\\icons.ts`)
      expect(paths.gitignorePath).toBe(`${process.cwd()}\\test\\icons\\.gitignore`)
    }
    else {
      expect(paths.iconsDir).toBe(`${process.cwd()}/test/icons/svg`)
      expect(paths.cacheDir).toBe(`${process.cwd()}/test/icons/cache`)
      expect(paths.filenamePath).toBe(`${process.cwd()}/test/icons/icons.ts`)
      expect(paths.gitignorePath).toBe(`${process.cwd()}/test/icons/.gitignore`)
    }
  })

  it('can package paths', () => {
    const packagePath = Utils.packagePath()
    const componentsPath = Utils.componentsPath()

    expect(packagePath).toBe(Utils.normalizePath('/Users/ewilan/Workspace/vite-plugin-svg/node_modules/unplugin-svg-transformer'))
    expect(componentsPath).toBe(Utils.normalizePath('/Users/ewilan/Workspace/vite-plugin-svg/node_modules/unplugin-svg-transformer/dist/components.d.ts'))
  })

  it('can create the gitignore file', async () => {
    // delete `.gitignore` file
    await rm(getPaths().gitignorePath, { force: true })

    // create `.gitignore` file
    await writeFile(getPaths().gitignorePath, '')

    await Utils.ignorePath(getPaths().cacheDir, getPaths().gitignorePath)
    const content = await Utils.read(getPaths().gitignorePath)

    const path = Utils.normalizePath('/test/icons/cache')
    expect(content).toBe(`\n${path}`)
  })
})
