import { readFile } from 'node:fs/promises'
import type { OptionsExtended, OptionsSvg } from '../../types'
import type { SvgItem } from './SvgItem'

export class SvgRender {
  public constructor(
    protected options: OptionsSvg,
    protected path?: string,
    protected title?: string,
    protected contents: string = '',

    protected svgClass: string[] = [],
    protected svgStyle: string[] = [],

    protected parentStart: string = '',
    protected parentEnd: string = '',
    protected children: string = '',
  ) { }

  public static make(options?: OptionsSvg): SvgRender {
    if (!options) {
      options = {
        classDefault: [],
        clearClass: 'none',
        clearSize: 'none',
        clearStyle: 'none',
        currentColor: false,
        inlineStyleDefault: [],
        sizeInherit: false,
        title: false,
      }
    }
    const self = new SvgRender(options)

    return self
  }

  public setContents(contents: string): SvgRender {
    this.contents = contents
    return this
  }

  public setPath(path: string): SvgRender {
    this.path = path
    return this
  }

  public setTitle(title: string): SvgRender {
    this.title = title
    return this
  }

  public async get(): Promise<SvgRender> {
    await this.readFile()
    this.contents = this.handleTitle()
    this.parse()

    if (this.options.classDefault) {
      this.svgClass = [
        ...this.svgClass,
        ...this.options.classDefault,
      ]
    }

    if (this.options.inlineStyleDefault) {
      this.svgStyle = [
        ...this.svgStyle,
        ...this.options.inlineStyleDefault,
      ]
    }

    if (this.options.clearSize === 'all') {
      this.parentStart = this.removeWidthAndHeight(this.parentStart)
      this.children = this.removeWidthAndHeight(this.children)
    }

    if (this.options.clearSize === 'parent')
      this.parentStart = this.removeWidthAndHeight(this.parentStart)

    if (this.options.clearClass === 'all') {
      this.parentStart = this.removeClass(this.parentStart)
      this.children = this.removeClass(this.children)
    }

    if (this.options.clearClass === 'parent')
      this.parentStart = this.removeClass(this.parentStart)

    if (this.options.clearStyle === 'all') {
      this.parentStart = this.removeInlineStyle(this.parentStart)
      this.children = this.removeInlineStyle(this.children)
    }

    if (this.options.clearStyle === 'parent')
      this.parentStart = this.removeInlineStyle(this.parentStart)

    if (this.options.currentColor)
      this.addInlineCurrentColor()

    this.contents = `${this.parentStart}${this.children}${this.parentEnd}`

    if (this.options.sizeInherit)
      this.addWidthAndHeightInherit()

    this.contents = this.addInlineStyle()
    this.contents = this.addClassDefault()
    this.contents = this.removeTooLargeSpaces()

    return this
  }

  public getContents(): string {
    return this.contents
  }

  private async readFile(): Promise<void> {
    if (!this.path)
      return

    try {
      this.contents = await readFile(this.path!, 'utf8')
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
    // if svgStyle don't contains width or height
    if (!this.svgStyle.some(style => /width:.*?;/.test(style))) {
      this.svgStyle = [
        ...this.svgStyle,
        'width: inherit;',
      ]
    }

    if (!this.svgStyle.some(style => /height:.*?;/.test(style))) {
      this.svgStyle = [
        ...this.svgStyle,
        'height: inherit;',
      ]
    }
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
    if (!this.options.classDefault || this.options.classDefault.length === 0)
      return this.contents

    const classDefault = this.svgClass.join(' ')
    // if class exists
    if (/class=".*?"/.test(this.contents))
      return this.contents.replace(/class=".*?"/, `class="${classDefault}"`)

    // if no class
    return this.contents.replace(/<svg/g, `<svg class="${classDefault}"`)
  }

  private handleTitle(): string {
    if (!this.options.title) {
      // remove title
      return this.contents.replace(/<title>.*?<\/title>/, '')
    }

    if (/<title>.*?<\/title>/.test(this.contents))
      return this.contents

    const svgTagRegex = /<svg([^>]*)>/i
    const match = svgTagRegex.exec(this.contents)
    if (!match)
      return this.contents

    const svgAttrs = match[1]
    const titleElement = `<title>${this.title}</title>`

    return this.contents.replace(svgTagRegex, `<svg${svgAttrs}>${titleElement}`)
  }

  private addInlineCurrentColor(): void {
    if (/stroke/.test(this.parentStart) && !/stroke="none"/.test(this.parentStart)) {
      if (/stroke="currentColor"/.test(this.parentStart))
        return

      this.parentStart = this.parentStart.replace(/<svg/g, '<svg stroke="currentColor"')
      return
    }

    if (/fill/.test(this.parentStart) && !/fill="none"/.test(this.parentStart)) {
      if (/fill="currentColor"/.test(this.parentStart))
        return

      this.parentStart = this.parentStart.replace(/<svg/g, '<svg fill="currentColor"')
    }

    if (!/fill="currentColor"/.test(this.parentStart) || !/stroke="currentColor"/.test(this.parentStart))
      this.parentStart = this.parentStart.replace(/<svg/g, '<svg fill="currentColor"')
  }
}
