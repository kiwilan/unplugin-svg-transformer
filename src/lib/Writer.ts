import { dirname } from 'node:path'
import type { Options } from '../types'
import { DefinitionFile } from './DefinitionFile'
import { LibraryFile } from './LibraryFile'
import { SvgCollection } from './Svg/SvgCollection'
import { Utils } from './Utils'

export class Writer {
  protected constructor(
    protected options: Options,
    protected collect?: SvgCollection,
    protected library?: LibraryFile,
    protected definition?: DefinitionFile,
  ) { }

  public static async make(options: Options): Promise<Writer> {
    const self = new Writer(options)

    self.options = {
      iconsDir: self.options.iconsDir,
      cacheDir: Utils.packagePath({ path: 'cache' }),
      filenamePath: Utils.rootPath(self.options.typescript ? 'icons.ts' : 'icons.js'),
      gitignorePath: self.options.gitignorePath,
      typescript: self.options.typescript,
      windowInject: self.options.windowInject,
    }

    await self.writeViteConfig(options, self.options)
    await Utils.rmDirectory(options.cacheDir!)

    await Utils.directoryExists(self.options.iconsDir!)
    await Utils.directoryExists(self.options.cacheDir!)
    await Utils.directoryExists(self.options.filenamePath!.substring(0, self.options.filenamePath!.lastIndexOf('/')))

    self.collect = await SvgCollection.make(options.iconsDir!)
    self.library = await LibraryFile.make(self.collect.getItems())
    self.definition = await DefinitionFile.make(self.library.getTypes())

    await self.writeIconFiles()
    await self.writeLibrary(Utils.rootPath('icons'), self.options.cacheDir!)
    await self.writeLibrary(Utils.packagePath({ dist: true, path: 'icons-index' }), './cache')
    if (self.options.typescript)
      await self.writeDefinition()

    return self
  }

  private async writeViteConfig(options: Options, writer: Options): Promise<boolean> {
    const path = Utils.viteConfig()

    if (await Utils.fileExists(path))
      await Utils.rm(path)

    let content = '{\n'
    content += '  "origin": {\n'
    content += `    "iconsDir": "${options.iconsDir}",\n`
    content += `    "cacheDir": "${options.cacheDir}",\n`
    content += `    "filenamePath": "${options.filenamePath}",\n`
    content += `    "gitignorePath": "${options.gitignorePath}"\n`
    content += '  },\n'
    content += '  "writer": {\n'
    content += `    "iconsDir": "${writer.iconsDir}",\n`
    content += `    "cacheDir": "${writer.cacheDir}",\n`
    content += `    "filenamePath": "${writer.filenamePath}",\n`
    content += `    "gitignorePath": "${writer.gitignorePath}"\n`
    content += '  }\n'
    content += '}\n'

    return await Utils.write(path, content)
  }

  private async writeIconFiles(): Promise<boolean> {
    const basePath = this.options.cacheDir
    const promises = this.collect!.getItems().map(async (item) => {
      let path = item.getPath().replace('.svg', this.options.typescript ? '.ts' : '.js')
      path = `${basePath}${path}`

      await Utils.rm(path)
      const dir = dirname(path)
      await Utils.directoryExists(dir)

      return await Utils.write(path, `export default '${item.getContent()}'\n`)
    })

    return await Promise.all(promises).then(() => true)
  }

  private async writeLibrary(filePath: string, cachePath: string): Promise<boolean> {
    filePath = this.options.typescript ? `${filePath}.ts` : `${filePath}.js`

    if (await Utils.fileExists(filePath))
      await Utils.rm(filePath)

    await this.library?.update(cachePath, this.options.windowInject, this.options.typescript)
    const content = this.library!.content()

    const dir = dirname(filePath)
    await Utils.directoryExists(dir)

    return await Utils.write(filePath, content)
  }

  private async writeDefinition(): Promise<boolean> {
    const definitionPath = Utils.rootPath('icons.d.ts')

    if (await Utils.fileExists(definitionPath))
      await Utils.rm(definitionPath)

    const definition = await Utils.write(definitionPath, this.definition!.getDefinition())

    const pathComponentType = Utils.componentsPath()

    if (!await Utils.fileExists(pathComponentType)) {
      const dir = dirname(pathComponentType)
      await Utils.directoryExists(dir)
      await Utils.write(pathComponentType, '')
    }

    const componentType = await Utils.write(pathComponentType, this.definition!.getComponentType())

    if (definition && componentType)
      return true

    return false
  }
}
