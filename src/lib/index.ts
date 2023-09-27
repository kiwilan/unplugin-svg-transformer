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
    await Path.ensureDirectoryExists(this.options.svgDir!)
    await Path.ensureDirectoryExists(this.cacheDir)
    await Path.ensureDirectoryExists(this.options.libraryDir!)
  }

  private async parse(): Promise<void> {
    this.collect = await SvgCollection.make(this.options.svgDir!)
    this.library = await LibraryFile.make(
      this.collect.getItems(),
      this.options,
    )
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
    await this.library?.writeAll(this.options.libraryDir!)

    if (this.options.useTypes) {
      await this.writeDefinition()
      await this.componentDefinition?.write()
      // if (this.options.windowInject && this.options.globalType)
      // await this.writeGlobalTypeFile()
    }

    //   await this.writeDefinition()
  }

  /**
   * Write icon file for each SVG into the cache directory.
   */
  public async writeIconFiles(cacheDir: string): Promise<boolean> {
    const basePath = cacheDir
    const promises = this.collect!.getItems().map(async (item) => {
      let path = item.getPath().replace('.svg', this.options.useTypes ? '.ts' : '.js')
      path = `${basePath}${path}`

      await Path.rm(path)
      const dir = dirname(path)
      await Path.ensureDirectoryExists(dir)

      return await Path.write(path, `export default '${item.getContent()}'\n`)
    })

    return await Promise.all(promises).then(() => true)
  }

  /**
   * Write the definition files.
   *
   * - `icons.d.ts` for Nuxt
   * - `client.d.ts` for Vite
   * - `icons.d.ts` for global types
   */
  private async writeDefinition(): Promise<void> {
    const globalPath = Path.rootPath('icons.d.ts')
    const nuxtPath = `${this.options.nuxtDir}/types/icons.d.ts`
    const clientPath = Path.packagePath({ dist: false, path: 'client.d.ts' })

    await Path.rm(clientPath)
    let viteContents = this.definition!.getContents()
    viteContents = viteContents.replace('\'unplugin-svg-transformer', '\'.')
    await Path.write(clientPath, viteContents)

    await Path.rm(globalPath)
    if (this.options.global)
      await Path.write(globalPath, this.definition!.getContents())

    const viteEnv = Path.rootPath('src/vite-env.d.ts')
    if (await Path.fileExists(viteEnv))
      await Path.appendLineIfNotExists(viteEnv, '/// <reference types="unplugin-svg-transformer/client" />')

    await Path.rm(nuxtPath)
    if (this.options.isNuxt)
      await Path.write(nuxtPath, this.definition!.getContents())
  }
}
