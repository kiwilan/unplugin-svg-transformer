import type { OptionsExtended } from '../../types'
import { SvgRender } from './SvgRender'

export class SvgItem {
  public constructor(
    protected basename: string = '',
    protected filename: string = '',
    protected name: string = '',
    protected title: string = '',
    protected fullPath: string = '',
    protected path: string = '',
    protected contents: string = '',
  ) { }

  public static async make(path: string, rootPath: string, options: OptionsExtended): Promise<SvgItem> {
    const self = new SvgItem()
    self.basename = path.replace(/^.*[\\\/]/, '')
    self.filename = self.basename.replace('.svg', '')
    self.fullPath = path
    self.path = path.replace(rootPath, '')
    self.name = self.nameFromPath()
    self.title = self.setTitle()

    const render = await SvgRender.make(options.svg)
      .setPath(path)
      .setTitle(self.title)
      .get()
    self.contents = render.getContents()

    return self
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
  public getContents(): string {
    return this.contents ?? 'undefined'
  }

  public static async getDefaultSvg(options: OptionsExtended, fallback: string): Promise<SvgItem> {
    return new SvgItem(
      'default.svg',
      'default',
      'default',
      'Default',
      'default.svg',
      '/default.svg',
      options.fallback ?? fallback,
    )
  }

  private nameFromPath(): string {
    let name = this.path!
    if (process.platform === 'win32')
      name = name.replace(/\\/g, '/')

    if (name.startsWith('/') || name.startsWith('\\'))
      name = name.substring(1)
    name = name.replace(/\.svg$/, '')
    name = name.replace(/ /g, '-')

    return name
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

    return string.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase())
  }
}
