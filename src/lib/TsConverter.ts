import path from 'node:path'
import { FileUtils } from './FileUtils'
import { SvgItem } from './SvgItem'

export class TsConverter {
  protected constructor(
    protected items: SvgItem[] = [],
    protected types?: string,
    protected list?: string,
    protected iconsDir?: string,
    protected cacheDir?: string,
    protected filenamePath?: string,
  ) { }

  public static async make(items: SvgItem[], iconsDir: string, cacheDir: string, filenamePath: string): Promise<TsConverter> {
    const self = new TsConverter(items)

    self.iconsDir = iconsDir
    self.cacheDir = cacheDir
    self.filenamePath = filenamePath
    self.types = await self.setTypes()
    self.list = await self.setList()
    await self.defaultSvgFile()

    await FileUtils.write(self.filenamePath, self.types + self.list)

    return self
  }

  private async defaultSvgFile() {
    const item = await SvgItem.defaultSvg()

    const directoryPath = this.cacheDir!
    await FileUtils.checkIfDirectoryExists(directoryPath)

    const filePath = path.join(directoryPath, `${item.getName()}.ts`)
    const contentTs = `export default '${item.getContent()}'\n`

    return FileUtils.write(filePath, contentTs)
  }

  private async setTypes() {
    let content = ''
    content += 'export type IconType = '
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
      content += `  '${item.getName()}': import('${relativePath}${path}'),\n`
    })
    content += `  'default': import('${relativePath}/default'),\n`
    content += '}\n'

    return content
  }
}
