import { dirname } from 'node:path'
import type { OptionsExtended } from '../types'
import { DefinitionFile } from './DefinitionFile'
import { LibraryFile } from './LibraryFile'
import { SvgCollection } from './Svg/SvgCollection'
import { Utils } from './Utils'

export class Writer {
  protected constructor(
    protected options: OptionsExtended,
    protected cacheDir: string,
    protected collect?: SvgCollection,
    protected library?: LibraryFile,
    protected definition?: DefinitionFile,
  ) { }

  public static async make(options: OptionsExtended): Promise<Writer> {
    const self = new Writer(options, Utils.packagePath({ path: 'cache' }))

    self.options = {
      iconsDir: self.options.iconsDir,
      libraryDir: self.options.libraryDir,
      gitignorePath: self.options.gitignorePath,
      typescript: self.options.typescript,
      windowInject: self.options.windowInject,
    }

    await Utils.rmDirectory(self.cacheDir)

    await Utils.directoryExists(self.options.iconsDir!)
    await Utils.directoryExists(self.cacheDir)
    await Utils.directoryExists(self.options.libraryDir!)

    self.collect = await SvgCollection.make(options.iconsDir!)
    self.library = await LibraryFile.make(self.collect.getItems())
    self.definition = await DefinitionFile.make(self.library.getTypes())

    await self.writeIconFiles()

    const rootLibraryDir = self.options.libraryDir!
    const packageLibraryDir = Utils.packagePath({ dist: true })

    const cache = await Utils.relativeToNodeModules(rootLibraryDir)
    await self.writeLibrary(rootLibraryDir, 'icons', cache)
    await self.writeLibrary(packageLibraryDir, 'icons-index', '../cache')

    if (self.options.typescript)
      await self.writeDefinition()

    return self
  }

  private async writeIconFiles(): Promise<boolean> {
    const basePath = this.cacheDir
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

  private async writeLibrary(directory: string, filename: string, cache: string): Promise<boolean> {
    directory = Utils.normalizePaths(`${directory}/`)
    filename = this.options.typescript ? `${filename}.ts` : `${filename}.js`
    const path = `${directory}${filename}`

    if (await Utils.fileExists(path))
      await Utils.rm(path)

    await this.library?.update(cache, this.options.windowInject, this.options.typescript)
    const content = this.library!.content()

    const dir = dirname(path)
    await Utils.directoryExists(dir)

    return await Utils.write(path, content)
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
