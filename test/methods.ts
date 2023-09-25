import { Path } from '../src/lib/Path'

export function getPaths() {
  const iconsDir = `${process.cwd()}/test/icons`
  const libraryDir = `${process.cwd()}/test/icons/icons.ts`
  const gitignorePath = `${process.cwd()}/test/icons/.gitignore`

  if (process.platform === 'win32') {
    return {
      iconsDir: Path.normalizePaths(iconsDir),
      libraryDir: Path.normalizePaths(libraryDir),
      gitignorePath: Path.normalizePaths(gitignorePath),
    }
  }

  return {
    iconsDir,
    libraryDir,
    gitignorePath,
  }
}
