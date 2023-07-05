import path, { join } from 'node:path'
import { Utils } from './Utils'
import { SvgItem } from './SvgItem'

export class ListFile {
  protected constructor(
    protected items: SvgItem[] = [],
    protected list?: string,
    protected types?: string,
    protected iconsDir?: string,
    protected cacheDir?: string,
    protected filenamePath?: string,
  ) { }

  public static async make(items: SvgItem[], iconsDir: string, cacheDir: string, filenamePath: string): Promise<ListFile> {
    const self = new ListFile(items)

    self.iconsDir = iconsDir
    self.cacheDir = cacheDir
    self.filenamePath = filenamePath

    const relativePath = path.relative(self.filenamePath, self.cacheDir)
    self.list = await self.setList(relativePath.substring(1))

    self.types = await self.setTypes()
    await self.defaultSvgFile()

    let indexPath = Utils.packagePath(true)
    indexPath = Utils.normalizePath(`${indexPath}/index-icons.ts`)

    await Utils.write(self.filenamePath, self.types + self.list)
    const list = await self.setList('./cache')
    await Utils.write(indexPath, self.types + list)

    return self
  }

  public getTypes(): string {
    return this.types!
  }

  private async defaultSvgFile(): Promise<void> {
    const item = await SvgItem.defaultSvg()

    const directoryPath = this.cacheDir!
    await Utils.directoryExists(directoryPath)

    const filePath = join(directoryPath, `${item.getName()}.ts`)
    const contentTs = `export default '${item.getContent()}'\n`

    let path = Utils.packagePath(true)
    path = Utils.normalizePath(`${path}/cache/default.ts`)
    await Utils.write(filePath, contentTs)
    await Utils.write(path, contentTs)
  }

  private async setTypes(): Promise<string> {
    let content = ''
    content += 'declare type IconType = '
    this.items.forEach((item, key) => {
      if (key > 0)
        content += ' | '

      content += `'${item.getName()}'`
    })

    if (this.items.length > 0)
      content += ' | \'default\''
    else
      content += '\'default\''

    content += '\n'

    return content
  }

  private async setList(relativePath: string) {
    let content = 'export const IconList: Record<IconType | string, Promise<{ default: string }>> = {\n'

    this.items.forEach((item) => {
      let path = item.getPath()
      path = path.replace('.svg', '')
      path = `${relativePath}${path}`
      // path = Utils.normalizePath(path, true)

      content += `  '${item.getName()}': import('${path}'),\n`
    })

    const baseDefaultPath = Utils.normalizePath('/default')
    const defaultPath = Utils.normalizePath(`${relativePath}${baseDefaultPath}`, true)

    content += `  'default': import('${defaultPath}'),\n`
    content += '}\n'

    return content
  }
}
