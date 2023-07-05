import { dirname } from 'node:path'
import { DefinitionFile } from './DefinitionFile'
import { IconListFile } from './IconListFile'
import { SvgCollection } from './Svg/SvgCollection'
import { Utils } from './Utils'

interface Paths {
  iconsDir: string
  cacheDir: string
  filenamePath: string
  gitignorePath: string
}

export class Writer {
  protected constructor(
    protected paths: Paths,
    protected collect?: SvgCollection,
    protected iconList?: IconListFile,
    protected definition?: DefinitionFile,
  ) { }

  public static async make(paths: Paths): Promise<Writer> {
    const self = new Writer(paths)

    self.paths = {
      iconsDir: self.paths.iconsDir,
      cacheDir: Utils.packagePath({ path: 'cache' }),
      filenamePath: Utils.rootPath('icons.ts'),
      gitignorePath: self.paths.gitignorePath,
    }

    await self.writeViteConfig(paths, self.paths)
    await Utils.rmDirectory(paths.cacheDir)

    await Utils.directoryExists(self.paths.iconsDir)
    await Utils.directoryExists(self.paths.cacheDir)
    await Utils.directoryExists(self.paths.filenamePath.substring(0, self.paths.filenamePath.lastIndexOf('/')))

    self.collect = await SvgCollection.make(paths.iconsDir)
    self.iconList = await IconListFile.make(self.collect.getItems())
    self.definition = await DefinitionFile.make(self.iconList.getTypes())

    await self.writeIconFiles()
    await self.writeIconList()
    await self.writeDefinition()

    return self
  }

  private async writeViteConfig(paths: Paths, writer: Paths): Promise<boolean> {
    const path = Utils.viteConfig()

    if (await Utils.fileExists(path))
      await Utils.rm(path)

    let content = '{\n'
    content += '  "origin": {\n'
    content += `    "iconsDir": "${paths.iconsDir}",\n`
    content += `    "cacheDir": "${paths.cacheDir}",\n`
    content += `    "filenamePath": "${paths.filenamePath}",\n`
    content += `    "gitignorePath": "${paths.gitignorePath}"\n`
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
    const basePath = this.paths.cacheDir
    const promises = this.collect!.getItems().map(async (item) => {
      let path = item.getPath().replace('.svg', '.ts')
      path = `${basePath}${path}`

      await Utils.rm(path)
      const dir = dirname(path)
      await Utils.directoryExists(dir)

      return await Utils.write(path, `export default '${item.getContent()}'\n`)
    })

    return await Promise.all(promises).then(() => true)
  }

  private async writeIconList(): Promise<boolean> {
    const path = Utils.rootPath('icons.ts')

    if (await Utils.fileExists(path))
      await Utils.rm(path)

    await this.iconList?.udpatePaths(this.paths.cacheDir)
    const content = this.iconList!.getTypes() + this.iconList!.getList()

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
