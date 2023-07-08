import type { SvgItem } from './Svg/SvgItem'
import { Utils } from './Utils'

export class LibraryFile {
  protected constructor(
    protected items: SvgItem[] = [],
    protected list?: string,
    protected types?: string,
  ) { }

  public static async make(items: SvgItem[]): Promise<LibraryFile> {
    const self = new LibraryFile(items)

    // const relativePath = path.relative(self.filenamePath, self.cacheDir)
    self.list = await self.setList()
    self.types = await self.setTypes()

    // const indexPath = Utils.packagePath({ path: 'index-icons.ts' })

    // await Utils.write(self.filenamePath, self.types + self.list)
    // await Utils.write(indexPath, self.types + list)

    return self
  }

  public getList(): string {
    return this.list!
  }

  public getTypes(): string {
    return this.types!
  }

  public content(): string {
    return this.types! + this.list!
  }

  public async update(path: string, window = true, typescript = true): Promise<string> {
    this.list = await this.setList(path, window, typescript)
    if (!typescript)
      this.types = ''

    return this.list
  }

  private async setTypes(): Promise<string> {
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

  private async setList(basePath = '', window = true, typescript = true): Promise<string> {
    let content = 'export const IconList: Record<IconType | string, Promise<{ default: string }>> = {\n'
    if (!typescript)
      content = 'export const IconList = {\n'

    this.items.forEach((item) => {
      const localPath = item.getPath()
      let path = Utils.normalizePaths([basePath, localPath])
      path = Utils.relativeToRoot(path)
      path = `.${path}`
      path = path.replace('.svg', '')

      content += `  '${item.getName()}': import('${path}'),\n`
    })

    content += '}\n'

    if (window) {
      content += '\n'
      content += 'if (typeof window !== \'undefined\') {\n'
      content += '  // @ts-expect-error type is global\n'
      content += '  window.iconList = IconList\n'
      content += '}\n'
    }

    return content
  }
}
