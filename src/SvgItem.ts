import fs from 'node:fs/promises'
import path from 'node:path'

export class SvgItem {
  protected constructor(
    protected name?: string,
    protected title?: string,
    protected fullPath?: string,
    protected path?: string,
    protected content?: string,
  ) { }

  public static async make(path: string, rootPath: string): Promise<SvgItem> {
    const self = new SvgItem()
    self.fullPath = path
    self.path = path.replace(rootPath, '')
    self.name = self.nameFromPath()
    self.title = self.setTitle()
    self.content = await self.svgContent()

    return self
  }

  public static async toList(directoryPath: string, rootPath: string): Promise<SvgItem[]> {
    const svgFiles: SvgItem[] = []

    const files = await fs.readdir(directoryPath)
    for (const file of files) {
      const filePath = path.join(directoryPath, file)
      const stats = await fs.stat(filePath)

      if (stats.isDirectory()) {
        const subFiles = await SvgItem.toList(filePath, rootPath)
        svgFiles.push(...subFiles)
      }
      else if (path.extname(file) === '.svg') {
        const item: SvgItem = await SvgItem.make(filePath, rootPath)
        svgFiles.push(item)
      }
    }

    return svgFiles
  }

  public getName(): string {
    return this.name ?? 'undefined'
  }

  public getTitle(): string {
    return this.title ?? 'undefined'
  }

  public getFullPath(): string {
    return this.fullPath ?? 'undefined'
  }

  public getPath(): string {
    return this.path ?? 'undefined'
  }

  public getContent(): string {
    return this.content ?? 'undefined'
  }

  private nameFromPath(): string {
    let name = this.path!
    name = name.replace(/\\/g, '/')
    name = name.replace(/\.svg$/, '')
    name = name.replace(/^\//, '')
    name = name.replace('/', '-')
    name = name.replace('\\', '-')

    return name
  }

  public static async defaultSvg(): Promise<SvgItem> {
    const content = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'

    const self = new SvgItem()
    self.name = 'default'
    self.title = 'Default'
    self.path = ''
    self.fullPath = ''
    self.content = await self.svgContent(content)

    return self
  }

  private async svgContent(content?: string): Promise<string | undefined> {
    if (!content)
      content = await fs.readFile(this.fullPath!, 'utf8')

    try {
      content = this.addInlineCurrentColor(content)
      content = this.removeBuiltInHeightAndWidth(content)
      content = this.addHeightAndWidthToSvgAsStyle(content)
      content = this.removeBreakLines(content)
      content = this.removeTooLargeSpaces(content)
      content = this.removeClasses(content)
      content = this.addTitleIfMissing(content)

      return content
    }
    catch (err) {
      console.error('Unable to read file:', err)
      return undefined
    }
  }

  private addTitleIfMissing(content: string): string {
    if (/<title>.*?<\/title>/.test(content))
      return content

    return content.replace(/<svg/g, `<svg><title>${this.title}</title>`)
  }

  private setTitle(): string {
    return this.capitalizeFirstLetter(this.name)
  }

  private capitalizeFirstLetter(string?: string): string {
    if (!string)
      return ''

    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  private addInlineCurrentColor(content: string): string {
    if (/fill="none"/.test(content)) {
      if (/stroke="currentColor"/.test(content))
        return content

      return content.replace(/<svg/g, '<svg stroke="currentColor"')
    }

    return content.replace(/<svg/g, '<svg fill="currentColor"')
  }

  private removeBuiltInHeightAndWidth(content: string): string {
    return content.replace(/height=".*?"/g, '').replace(/width=".*?"/g, '')
  }

  private addHeightAndWidthToSvgAsStyle(content: string) {
    return content.replace(/<svg/g, '<svg style="height: inherit; width: inherit;"')
  }

  private removeBreakLines(content: string): string {
    return content.replace(/\r?\n|\r/g, '')
  }

  private removeTooLargeSpaces(content: string): string {
    return content.replace(/\s{2,}/g, ' ')
  }

  private removeClasses(content: string): string {
    return content.replace(/class=".*?"/g, '')
  }
}
