import fs from 'node:fs/promises'
import path from 'node:path'

export class SvgItem {
  protected constructor(
    protected basename?: string,
    protected filename?: string,
    protected name?: string,
    protected title?: string,
    protected fullPath?: string,
    protected path?: string,
    protected content?: string,
  ) { }

  public static async make(path: string, rootPath: string): Promise<SvgItem> {
    const self = new SvgItem()
    self.basename = path.replace(/^.*[\\\/]/, '')
    self.filename = self.basename.replace('.svg', '')
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

  /**
   * Filename.
   *
   * @example `youtube`
   */
  public getFilename(): string {
    return this.filename ?? 'undefined'
  }

  /**
   * Basename.
   *
   * @example `youtube.svg`
   */
  public getBasename(): string {
    return this.basename ?? 'undefined'
  }

  /**
   * Name.
   *
   * @example `youtube`
   */
  public getName(): string {
    return this.name ?? 'undefined'
  }

  /**
   * Title.
   *
   * @example `Youtube`
   */
  public getTitle(): string {
    return this.title ?? 'undefined'
  }

  /**
   * Full path.
   *
   * @example `/home/user/project/src/assets/icons/svg/social/youtube.svg`
   */
  public getFullPath(): string {
    return this.fullPath ?? 'undefined'
  }

  /**
   * Path.
   *
   * @example `/social/youtube.svg`
   */
  public getPath(): string {
    return this.path ?? 'undefined'
  }

  /**
   * Content.
   *
   * @example `<svg></svg>`
   */
  public getContent(): string {
    return this.content ?? 'undefined'
  }

  private nameFromPath(): string {
    let name = this.path!
    if (name.startsWith('/'))
      name = name.substring(1)
    name = name.replace(/\.svg$/, '')
    name = name.replace(/[^\w\s]/gi, '-')
    name = name.replace(/\\/g, '-')

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
      content = this.addDefaultStyle(content)
      content = this.removeBreakLines(content)
      content = this.removeClasses(content)
      content = this.addTitleIfMissing(content)
      content = this.removeTooLargeSpaces(content)

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

    return content.replace(/<svg(?![^>]*\s)([^>]*)/, `<svg$1><title>${this.title}</title>`)
  }

  private setTitle(): string {
    if (!this.filename)
      return ''

    let name = this.filename
    name = name.replace(/\.svg$/, '')
    name = name.replace(/-/g, ' ')

    return this.capitalizeEveryWord(name)
  }

  private capitalizeEveryWord(string: string): string {
    if (!string)
      return ''

    return string.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    })
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

  private addDefaultStyle(content: string) {
    const styles = [
      'display: inline-block;',
      'height: inherit;',
      'width: inherit;',
    ]
    const style = styles.join(' ')

    return content.replace(/<svg/g, `<svg style="${style}"`)
  }

  private removeBreakLines(content: string): string {
    return content.replace(/\r?\n|\r/g, '')
  }

  private removeTooLargeSpaces(content: string): string {
    content = content.replace(/\s{2,}/g, ' ')
    content = content.replace(/>\s</g, '><')

    return content
  }

  private removeClasses(content: string): string {
    return content.replace(/class=".*?"/g, '')
  }
}
