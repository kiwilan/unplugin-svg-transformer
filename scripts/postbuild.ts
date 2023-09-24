import { basename, dirname, resolve } from 'node:path'
import { promises as fs } from 'node:fs'
import { fileURLToPath } from 'node:url'
import fg from 'fast-glob'
import chalk from 'chalk'

async function run() {
  // fix cjs exports
  const files = await fg('*.cjs', {
    ignore: ['chunk-*'],
    absolute: true,
    cwd: resolve(dirname(fileURLToPath(import.meta.url)), '../dist'),
  })
  for (const file of files) {
    console.log(chalk.cyan.inverse(' POST '), `Fix ${basename(file)}`)
    let code = await fs.readFile(file, 'utf8')
    code = code.replace('exports.default =', 'module.exports =')
    code += 'exports.default = module.exports;'
    await fs.writeFile(file, code)
  }

  // let content = await fs.readFile(VueSvgPath, 'utf8')
  // content = content.replace('export {\nVueSvg,\n}\n', 'export default VueSvg\n')

  // const lines = content.split('\n')
  // // delete four last lines
  // lines.splice(-4)
  // // add export default VueSvg
  // lines.push('export default VueSvg\n')
  // content = lines.join('\n')

  await fs.mkdir('./dist/render', { recursive: true })
  await fs.copyFile('./src/render/NuxtSvg.ts', './dist/render/NuxtSvg.ts')
  await fs.copyFile('./src/render/shared.ts', './dist/render/shared.ts')

  // const NuxtTypePath = resolve('./dist/nuxt.d.ts')
  // const contents = [
  //   'import { Options } from "./types.js"',
  //   '',
  //   'declare module \'@nuxt/schema\' {',
  //   '  interface NuxtConfig { [\'svgTransformer\']?: Partial<Options> }',
  //   '  interface NuxtOptions { [\'svgTransformer\']?: Options }',
  //   '}',
  //   '',
  //   'export { Options, default } from \'./types.js\'',
  //   '',
  // ]

  // await fs.writeFile(NuxtTypePath, contents.join('\n'))
}

run()
