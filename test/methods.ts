import { Path } from '../src/lib/Path'

export function getPaths() {
  const svgDir = Path.normalizePaths(`${process.cwd()}/test/icons`)
  const libraryDir = Path.normalizePaths(`${process.cwd()}/test`)
  const cacheDir = Path.normalizePaths(`${process.cwd()}/test/cache`)
  const gitignorePath = Path.normalizePaths(`${process.cwd()}/test/icons/.gitignore`)

  return {
    svgDir,
    libraryDir,
    cacheDir,
    gitignorePath,
  }
}
