import fs from 'node:fs/promises'
import path, { dirname } from 'node:path'
import type { OptionsExtended } from '../../types'
import { Path } from '../Path'
import { SvgItem } from './SvgItem'

export class SvgCollection {
  protected constructor(
    protected options: OptionsExtended,
    protected directoryPath: string,
    protected rootPath: string,
    protected items: SvgItem[],
  ) { }

  public static async make(options: OptionsExtended, rootPath?: string): Promise<SvgCollection> {
    const svgDir = options.svgDir!
    rootPath = rootPath || svgDir
    const self = new SvgCollection(options, svgDir, rootPath, [])
    self.items = await self.parse(svgDir, rootPath)
    self.items.push(await self.addDefaultSvg())

    return self
  }

  public getItems(): SvgItem[] {
    return this.items
  }

  private async parse(directoryPath: string, rootPath?: string): Promise<SvgItem[]> {
    const svgFiles: SvgItem[] = []
    if (!rootPath)
      rootPath = directoryPath

    const files = await fs.readdir(directoryPath)
    for (const file of files) {
      const filePath = path.join(directoryPath, file)
      const stats = await fs.stat(filePath)

      if (stats.isDirectory()) {
        const subFiles = await this.parse(filePath, rootPath)
        svgFiles.push(...subFiles)
      }
      else if (path.extname(file) === '.svg') {
        const item: SvgItem = await SvgItem.make(filePath, rootPath)
        svgFiles.push(item)
      }
    }

    return svgFiles
  }

  public async print(): Promise<string[]> {
    const itemsContent: string[] = []

    await Promise.all(this.items.map(async (item) => {
      let content = item.getContent()
      content = `export default '${content}'\n`

      itemsContent.push(content)
    }))

    return itemsContent
  }

  private async addDefaultSvg(): Promise<SvgItem> {
    const content = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'

    const item = new SvgItem(
      'default.svg',
      'default',
      'default',
      'Default',
      'default.svg',
      '/default.svg',
    )
    await item.setContent(content)

    return item
  }

  public async write(cacheDir: string): Promise<void> {
    const basePath = cacheDir
    const promises = this.items.map(async (item) => {
      let path = item.getPath().replace('.svg', this.options.useTypes ? '.ts' : '.js')
      path = `${basePath}${path}`

      await Path.rm(path)
      const dir = dirname(path)
      await Path.ensureDirectoryExists(dir)

      return await Path.write(path, `export default '${item.getContent()}'\n`)
    })

    await Promise.all(promises).then(() => true)
  }
}
