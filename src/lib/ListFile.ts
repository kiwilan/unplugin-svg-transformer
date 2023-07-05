import path from 'node:path'
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
    self.list = await self.setList()
    self.types = await self.setTypes()
    await self.defaultSvgFile()

    await Utils.write(self.filenamePath, self.types + self.list)

    return self
  }

  private async defaultSvgFile() {
    const item = await SvgItem.defaultSvg()

    const directoryPath = this.cacheDir!
    await Utils.directoryExists(directoryPath)

    const filePath = path.join(directoryPath, `${item.getName()}.ts`)
    const contentTs = `export default '${item.getContent()}'\n`

    return Utils.write(filePath, contentTs)
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

  private async setList() {
    const filenamePath = this.filenamePath!
    const cachePath = this.cacheDir!
    let relativePath = path.relative(filenamePath, cachePath)
    relativePath = relativePath.substring(1)

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
