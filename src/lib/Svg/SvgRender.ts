import { readFile } from 'node:fs/promises'
import type { OptionsExtended } from '../../types'
import type { SvgItem } from './SvgItem'

export class SvgRender {
  public constructor(
    protected svgItem: SvgItem,
    protected options: OptionsExtended,
    protected contents: string = '',

    protected svgClass: string[] = [],
    protected svgStyle: string[] = [],

    protected parentStart: string = '',
    protected parentEnd: string = '',
    protected children: string = '',
  ) { }

  public static async make(item: SvgItem, options: OptionsExtended): Promise<SvgRender> {
    const self = new SvgRender(item, options)
    await self.readFile()
    if (options.svg?.title)
      self.contents = self.addTitleIfMissing()
    self.parse()

    if (options.svg?.classDefault) {
      self.svgClass = [
        ...self.svgClass,
        ...options.svg.classDefault,
      ]
    }

    if (options.svg?.inlineStyleDefault) {
      self.svgStyle = [
        ...self.svgStyle,
        ...options.svg.inlineStyleDefault,
      ]
    }

    if (options.svg?.clearSize === 'all') {
      self.parentStart = self.removeWidthAndHeight(self.parentStart)
      self.children = self.removeWidthAndHeight(self.children)
    }

    if (options.svg?.clearSize === 'parent')
      self.parentStart = self.removeWidthAndHeight(self.parentStart)

    if (options.svg?.clearClass === 'all') {
      self.parentStart = self.removeClass(self.parentStart)
      self.children = self.removeClass(self.children)
    }

    if (options.svg?.clearClass === 'parent')
      self.parentStart = self.removeClass(self.parentStart)

    if (options.svg?.clearStyle === 'all') {
      self.parentStart = self.removeInlineStyle(self.parentStart)
      self.children = self.removeInlineStyle(self.children)
    }

    if (options.svg?.clearStyle === 'parent')
      self.parentStart = self.removeInlineStyle(self.parentStart)

    self.contents = `${self.parentStart}${self.children}${self.parentEnd}`

    if (options.svg?.sizeInherit)
      self.addWidthAndHeightInherit()
    if (options.svg?.currentColor)
      self.contents = self.addInlineCurrentColor()

    self.contents = self.addInlineStyle()
    self.contents = self.addClassDefault()
    self.contents = self.removeTooLargeSpaces()

    return self
  }

  public getContents(): string {
    return this.contents
  }

  private async readFile(): Promise<void> {
    try {
      this.contents = await readFile(this.svgItem.getFullPath()!, 'utf8')
    }
    catch (err) {
      // console.error('Unable to read file:', err)
    }
  }

  private parse(): void {
    this.contents = this.removeBreakLines()
    this.contents = this.removeTooLargeSpaces()

    const matches = this.contents.match(/(<[^>]+>|[^<]+)/g)
    let filter: string[] = []
    if (matches)
      filter = matches.filter(n => n !== ' ')
    else
      filter = [this.contents]

    this.parentStart = filter.shift()?.trim() ?? ''
    this.parentEnd = filter.pop()?.trim() ?? ''
    this.children = filter.join('').trim() ?? ''
  }

  private removeBreakLines(): string {
    // const contents = this.contents.replace(/^ +/gm, '')
    return this.contents.replace(/\r?\n|\r/g, '')
  }

  private removeTooLargeSpaces(): string {
    return this.contents.replace(/\s{2,}/g, ' ')
      .replace(/>\s</g, '><')
      .trim()
  }

  private removeClass(contents: string): string {
    return contents.replace(/class=".*?"/g, '')
  }

  private removeInlineStyle(contents: string): string {
    return contents.replace(/style=".*?"/g, '')
  }

  private removeWidthAndHeight(contents: string): string {
    return contents.replace(/width=".*?"/g, '')
      .replace(/height=".*?"/g, '')
  }

  private addWidthAndHeightInherit(): void {
    this.svgStyle = [
      ...this.svgStyle,
      'height: inherit;',
      'width: inherit;',
    ]
  }

  private addInlineStyle(): string {
    if (this.svgStyle.length === 0)
      return this.contents

    const style = this.svgStyle.join(' ')
    // if inline style exists
    if (/style=".*?"/.test(this.contents))
      return this.contents.replace(/style=".*?"/, `style="${style}"`)

    // if no inline style
    return this.contents.replace(/<svg/g, `<svg style="${style}"`)
  }

  private addClassDefault(): string {
    if (!this.options.svg?.classDefault)
      return this.contents

    const classDefault = this.svgClass.join(' ')
    // if class exists
    if (/class=".*?"/.test(this.contents))
      return this.contents.replace(/class=".*?"/, `class="${classDefault}"`)

    // if no class
    return this.contents.replace(/<svg/g, `<svg class="${classDefault}"`)
  }

  private addTitleIfMissing(): string {
    if (/<title>.*?<\/title>/.test(this.contents))
      return this.contents

    const svgTagRegex = /<svg([^>]*)>/i
    const match = svgTagRegex.exec(this.contents)
    if (!match)
      return this.contents

    const svgAttrs = match[1]
    const titleElement = `<title>${this.svgItem.getTitle()}</title>`

    return this.contents.replace(svgTagRegex, `<svg${svgAttrs}>${titleElement}`)
  }

  private addInlineCurrentColor(): string {
    if (/fill="none"/.test(this.contents)) {
      if (/stroke="currentColor"/.test(this.contents))
        return this.contents

      return this.contents.replace(/<svg/g, '<svg stroke="currentColor"')
    }

    return this.contents.replace(/<svg/g, '<svg fill="currentColor"')
  }
}
