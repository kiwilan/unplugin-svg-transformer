import { Utils } from '../src/lib/Utils'

export function getPaths() {
  const iconsDir = `${process.cwd()}/test/icons/svg`
  const cacheDir = `${process.cwd()}/test/icons/cache`
  const filenamePath = `${process.cwd()}/test/icons/icons.ts`
  const gitignorePath = `${process.cwd()}/test/icons/.gitignore`

  if (process.platform === 'win32') {
    return {
      iconsDir: Utils.normalizePath(iconsDir),
      cacheDir: Utils.normalizePath(cacheDir),
      filenamePath: Utils.normalizePath(filenamePath),
      gitignorePath: Utils.normalizePath(gitignorePath),
    }
  }

  return {
    iconsDir,
    cacheDir,
    filenamePath,
    gitignorePath,
  }
}
