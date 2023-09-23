import { dirname } from 'node:path'
import type { OptionsExtended } from '../types'
import { DefinitionFile } from './DefinitionFile'
import { LibraryFile } from './LibraryFile'
import { SvgCollection } from './Svg/SvgCollection'
import { Utils } from './Utils'
import { GlobalTypeFile } from './GlobalTypeFile'
import { ComponentDefinitionFile } from './ComponentDefinitionFile'

export class SvgTransformer {
  protected constructor(
    protected options: OptionsExtended,
    protected cacheDir: string,
    protected collect?: SvgCollection,
    protected library?: LibraryFile,
    protected definition?: DefinitionFile,
    protected componentDefinition?: ComponentDefinitionFile,

    protected paths: {
      definitionPath?: string
      componentDefinitionPath?: string
      libraryPath?: string
    } = {},
    protected relativePaths: {
      definitionPath?: string
      componentDefinitionPath?: string
      libraryPath?: string
    } = {},
  ) { }

  public static async make(options: OptionsExtended): Promise<SvgTransformer> {
    const self = new SvgTransformer(options, Utils.packagePath({ path: 'cache' }))
    if (options.isNuxt)
      options.libraryDir = options.nuxtLibraryDir

    await self.handleDirectories()
    await self.parse()
    await self.write()

    const root = Utils.rootPath()

    self.relativePaths.definitionPath = self.paths.definitionPath?.replace(root, '')
    self.relativePaths.componentDefinitionPath = self.paths.componentDefinitionPath?.replace(root, '')
    self.relativePaths.libraryPath = self.paths.libraryPath?.replace(root, '')

    return self
  }

  public getOptions(): OptionsExtended {
    return this.options
  }

  public getCacheDir(): string {
    return this.cacheDir
  }

  public getSvgCollection(): SvgCollection {
    return this.collect!
  }

  public getLibrary(): LibraryFile {
    return this.library!
  }

  public getDefinition(): DefinitionFile {
    return this.definition!
  }

  public getComponentDefinition(): ComponentDefinitionFile {
    return this.componentDefinition!
  }

  public getPaths(): {
    definitionPath?: string
    componentDefinitionPath?: string
    libraryPath?: string
  } {
    return this.paths!
  }

  public getRelativePaths(): {
    definitionPath?: string
    componentDefinitionPath?: string
    libraryPath?: string
  } {
    return this.relativePaths!
  }

  private async handleDirectories(): Promise<void> {
    // Remove cache directory
    await Utils.deleteDirectory(this.cacheDir)

    // Create icons directory, library directory and cache directory
    await Utils.ensureDirectoryExists(this.options.iconsDir!)
    await Utils.ensureDirectoryExists(this.cacheDir)
    await Utils.ensureDirectoryExists(this.options.libraryDir!)
  }

  private async parse(): Promise<void> {
    this.collect = await SvgCollection.make(this.options.iconsDir!)
    this.library = await LibraryFile.make(this.collect.getItems(), this.options.isNuxt || false)
    this.definition = await DefinitionFile.make(this.library.getTypes(), this.options.isNuxt || false)
    this.componentDefinition = await ComponentDefinitionFile.make(this.library.getTypes())
  }

  private async write(): Promise<void> {
    let cacheDir = this.cacheDir
    if (this.options.isNuxt) {
      cacheDir = `${this.options.nuxtBuildDir}/icons`
      await Utils.deleteDirectory(cacheDir)
      await Utils.ensureDirectoryExists(cacheDir)
    }
    await this.writeIconFiles(cacheDir)

    const rootLibraryDir = this.options.libraryDir!
    const packageLibraryDir = Utils.packagePath({ dist: true })

    const cache = await Utils.relativeToNodeModules(rootLibraryDir)
    await this.writeLibrary(rootLibraryDir, 'icons-library', cache)
    await this.writeLibrary(packageLibraryDir, 'icons-index', '../cache')

    if (this.options.types) {
      await this.writeDefinition()
      await this.writeComponentDefinition()
      // if (this.options.windowInject && this.options.globalType)
      // await this.writeGlobalTypeFile()
    }

    //   await this.writeDefinition()
  }

  // /**
  //  * Create `global.d.ts` file.
  //  */
  // private async writeGlobalTypeFile(): Promise<boolean> {
  //   const global = await GlobalTypeFile.make()
  //   return await Utils.write(global.getPath(), global.getContent())
  // }

  /**
   * Write icon file for each SVG into the cache directory.
   */
  public async writeIconFiles(cacheDir: string): Promise<boolean> {
    const basePath = cacheDir
    const promises = this.collect!.getItems().map(async (item) => {
      let path = item.getPath().replace('.svg', this.options.types ? '.ts' : '.js')
      path = `${basePath}${path}`

      await Utils.rm(path)
      const dir = dirname(path)
      await Utils.ensureDirectoryExists(dir)

      return await Utils.write(path, `export default '${item.getContent()}'\n`)
    })

    return await Promise.all(promises).then(() => true)
  }

  /**
   * Write library file, `icon.ts`.
   */
  public async writeLibrary(directory: string, filename: string, cache: string): Promise<boolean> {
    directory = Utils.normalizePaths(`${directory}/`)
    filename = this.options.types ? `${filename}.ts` : `${filename}.js`
    const path = `${directory}${filename}`

    if (await Utils.fileExists(path))
      await Utils.rm(path)

    await this.library?.update(cache, this.options.windowInject, this.options.types)
    const content = this.library!.content()

    const dir = dirname(path)
    await Utils.ensureDirectoryExists(dir)

    this.paths.libraryPath = path

    return await Utils.write(path, content)
  }

  /**
   * Write the definition file, `global.d.ts`.
   *
   * This file contains `window.iconList` definition for TypeScript.
   */
  private async writeDefinition(): Promise<boolean> {
    // const definitionPath = Utils.rootPath('icons.d.ts')
    let definitionPath = Utils.rootPath('global.d.ts')

    if (this.options.isNuxt)
      definitionPath = `${this.options.nuxtBuildDir}/types/icons.d.ts`

    // Override it if it exists
    if (await Utils.fileExists(definitionPath))
      await Utils.rm(definitionPath)

    this.paths.definitionPath = definitionPath

    // Create definition file
    return await Utils.write(definitionPath, this.definition!.getContents())
  }

  /**
   * Write the component definition file.
   */
  private async writeComponentDefinition(): Promise<boolean> {
    // Get component type path
    const pathComponentType = Utils.componentsPath()

    // If not exists, create it
    if (!await Utils.fileExists(pathComponentType)) {
      const dir = dirname(pathComponentType)
      await Utils.ensureDirectoryExists(dir)
      await Utils.write(pathComponentType, '')
    }

    this.paths.componentDefinitionPath = pathComponentType

    return await Utils.write(pathComponentType, this.componentDefinition!.getContents())
  }
}
