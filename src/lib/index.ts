import { dirname } from 'node:path'
import type { OptionsExtended } from '../types'
import { DefinitionFile } from './Definition/DefinitionFile'
import { LibraryFile } from './LibraryFile'
import { SvgCollection } from './Svg/SvgCollection'
import { Path } from './Path'
import { ComponentDefinitionFile } from './Definition/ComponentDefinitionFile'

export class SvgTransformer {
  protected constructor(
    protected options: OptionsExtended,
    protected cacheDir: string,
    protected collect?: SvgCollection,
    protected library?: LibraryFile,
    protected definition?: DefinitionFile,
    protected componentDefinition?: ComponentDefinitionFile,
  ) { }

  public static async make(options: OptionsExtended): Promise<SvgTransformer> {
    const self = new SvgTransformer(options, Path.packagePath({ path: 'cache' }))
    if (options.isNuxt)
      options.libraryDir = options.nuxtDir

    await self.handleDirectories()
    await self.parse()
    await self.write()

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

  private async handleDirectories(): Promise<void> {
    // Remove cache directory
    await Path.deleteDirectory(this.cacheDir)

    // Create icons directory, library directory and cache directory
    await Path.ensureDirectoryExists(this.options.iconsDir!)
    await Path.ensureDirectoryExists(this.cacheDir)
    await Path.ensureDirectoryExists(this.options.libraryDir!)
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
      cacheDir = `${this.options.nuxtDir}/icons`
      await Path.deleteDirectory(cacheDir)
      await Path.ensureDirectoryExists(cacheDir)
    }
    await this.writeIconFiles(cacheDir)

    const rootLibraryDir = this.options.libraryDir!
    const packageLibraryDir = Path.packagePath({ dist: true })

    const cache = await Path.relativeToNodeModules(rootLibraryDir)
    await this.writeLibrary(rootLibraryDir, 'icons', cache)
    await this.writeLibrary(packageLibraryDir, 'icons', '../cache')

    if (this.options.types) {
      await this.writeDefinition()
      if (this.options.isNuxt)
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
  //   return await Path.write(global.getPath(), global.getContent())
  // }

  /**
   * Write icon file for each SVG into the cache directory.
   */
  public async writeIconFiles(cacheDir: string): Promise<boolean> {
    const basePath = cacheDir
    const promises = this.collect!.getItems().map(async (item) => {
      let path = item.getPath().replace('.svg', this.options.types ? '.ts' : '.js')
      path = `${basePath}${path}`

      await Path.rm(path)
      const dir = dirname(path)
      await Path.ensureDirectoryExists(dir)

      return await Path.write(path, `export default '${item.getContent()}'\n`)
    })

    return await Promise.all(promises).then(() => true)
  }

  /**
   * Write library file, `icon.ts`.
   */
  public async writeLibrary(directory: string, filename: string, cache: string): Promise<boolean> {
    directory = Path.normalizePaths(`${directory}/`)
    filename = this.options.types ? `${filename}.ts` : `${filename}.js`
    const path = `${directory}${filename}`

    if (await Path.fileExists(path))
      await Path.rm(path)

    await this.library?.update(cache, true, this.options.types)
    const content = this.library!.content()

    const dir = dirname(path)
    await Path.ensureDirectoryExists(dir)

    return await Path.write(path, content)
  }

  /**
   * Write the definition files.
   *
   * - `icons.d.ts` for Nuxt
   * - `client.d.ts` for Vite
   * - `global.d.ts` for global types
   */
  private async writeDefinition(): Promise<void> {
    const globalPath = Path.rootPath('global.d.ts')
    const nuxtPath = `${this.options.nuxtDir}/types/icons.d.ts`
    const clientPath = Path.packagePath({ dist: false, path: 'client.d.ts' })

    await Path.rm(clientPath)
    let viteContents = this.definition!.getContents()
    viteContents = viteContents.replace('\'unplugin-svg-transformer', '\'.')
    await Path.write(clientPath, viteContents)

    await Path.rm(globalPath)
    if (this.options.globalTypes)
      await Path.write(globalPath, this.definition!.getContents())

    const viteEnv = Path.rootPath('src/vite-env.d.ts')
    if (await Path.fileExists(viteEnv))
      await Path.appendLineIfNotExists(viteEnv, '/// <reference types="unplugin-svg-transformer/client" />')

    await Path.rm(nuxtPath)
    if (this.options.isNuxt)
      await Path.write(nuxtPath, this.definition!.getContents())
  }

  /**
   * Write the component definition file.
   */
  private async writeComponentDefinition(): Promise<void> {
    await this.componentDefinition?.write()
  }
}
