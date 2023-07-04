import path from 'node:path'
import { FileUtils } from './FileUtils'
import { SvgItem } from './SvgItem'
import type { VitePluginSvgOptions } from '.'

export class TsConverter {
  protected constructor(
    protected items: SvgItem[] = [],
    protected types?: string,
    protected list?: string,
    protected opts?: VitePluginSvgOptions,
  ) { }

  public static async make(items: SvgItem[], opts: VitePluginSvgOptions): Promise<TsConverter> {
    const self = new TsConverter(items)

    self.opts = opts
    self.types = await self.setTypes()
    self.list = await self.setList()
    await self.defaultSvgFile()

    await FileUtils.write(opts.filenamePath, self.types + self.list)

    return self
  }

  private async defaultSvgFile() {
    const item = await SvgItem.defaultSvg()

    const directoryPath = this.opts!.cacheDir
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
    const filenamePath = this.opts!.filenamePath
    const cachePath = this.opts!.cacheDir
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
