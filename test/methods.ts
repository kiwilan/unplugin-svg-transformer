import { Utils } from '../src/lib/Utils'

export function getPaths() {
  const iconsDir = `${process.cwd()}/test/icons`
  const libraryDir = `${process.cwd()}/test/icons/icons.ts`
  const gitignorePath = `${process.cwd()}/test/icons/.gitignore`

  if (process.platform === 'win32') {
    return {
      iconsDir: Utils.normalizePaths(iconsDir),
      libraryDir: Utils.normalizePaths(libraryDir),
      gitignorePath: Utils.normalizePaths(gitignorePath),
    }
  }

  return {
    iconsDir,
    libraryDir,
    gitignorePath,
  }
}
