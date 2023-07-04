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

    self.types = await self.setTypes()
    self.list = await self.setList()
    self.opts = opts
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
    content += '\n'

    return content
  }

  private async setList() {
    let content = 'export const IconList: Record<IconType | string, Promise<{ default: string }>> = {\n'
    const basePath = './Icons/cache/'

    this.items.forEach((item) => {
      content += `  '${item.getName()}': import('${basePath}${item.getName()}'),\n`
    })
    content += `  'default': import('${basePath}default'),\n`
    content += '}\n'

    return content
  }
}
