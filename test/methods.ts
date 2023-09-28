import { Path } from '../src/lib/Path'

export function getPaths() {
  const svgDir = Path.normalizePaths(`${process.cwd()}/test/icons`)
  const libraryDir = Path.normalizePaths(`${process.cwd()}/test`)
  const cacheDir = Path.normalizePaths(`${process.cwd()}/test/cache`)

  return {
    svgDir,
    libraryDir,
    cacheDir,
  }
}

export async function clean() {
  const paths = getPaths()
  await Path.rm(`${paths.libraryDir}/icons.ts`)
  await Path.rm(paths.cacheDir)
  await Path.unLink(`${process.cwd}/node_modules/unplugin-svg-transformer/dist/icons.ts`)
}
