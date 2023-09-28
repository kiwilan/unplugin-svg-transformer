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
    const cacheDir = options.cacheDir || Path.packagePath({ path: 'cache' })
    const self = new SvgTransformer(options, cacheDir)
    if (options.isNuxt)
      options.libraryDir = options.nuxtDir

    await self.handleDirectories()
    await self.parse()
    await self.write()

    return self
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
    this.collect = await SvgCollection.make(this.options)
    this.library = await LibraryFile.make(this.collect, this.options)
    this.definition = await DefinitionFile.make(this.options, this.library.getTypesString(), this.options.isNuxt || false)
    this.componentDefinition = await ComponentDefinitionFile.make(this.library.getTypesString())
  }

  private async write(): Promise<void> {
    let cacheDir = this.cacheDir
    if (this.options.isNuxt) {
      cacheDir = `${this.options.nuxtDir}/icons`
      await Path.deleteDirectory(cacheDir)
      await Path.ensureDirectoryExists(cacheDir)
    }
    await this.collect?.write(cacheDir)
    await this.library?.write()

    if (this.options.useTypes) {
      await this.definition?.write()
      await this.componentDefinition?.write()
    }

    await this.componentDefinition?.write()
  }
}
