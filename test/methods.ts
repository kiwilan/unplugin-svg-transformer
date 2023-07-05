import { Utils } from '../src/lib/Utils'

export function getPaths() {
  const iconsDir = `${process.cwd()}/test/icons`
  const cacheDir = `${process.cwd()}/test/icons/cache`
  const filenamePath = `${process.cwd()}/test/icons/icons.ts`
  const gitignorePath = `${process.cwd()}/test/icons/.gitignore`

  if (process.platform === 'win32') {
    return {
      iconsDir: Utils.normalizePaths(iconsDir),
      cacheDir: Utils.normalizePaths(cacheDir),
      filenamePath: Utils.normalizePaths(filenamePath),
      gitignorePath: Utils.normalizePaths(gitignorePath),
    }
  }

  return {
    iconsDir,
    cacheDir,
    filenamePath,
    gitignorePath,
  }
}
