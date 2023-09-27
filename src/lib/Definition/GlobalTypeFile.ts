import { Path } from '../Path'

export class GlobalTypeFile {
  protected constructor(
    protected path: string = 'global.d.ts',
    protected content: string = '',
  ) { }

  public static async make(): Promise<GlobalTypeFile> {
    const self = new GlobalTypeFile()

    const root = Path.rootPath()
    self.path = `${root}/global.d.ts`

    self.content = self.defaultFile()
    // if (!await Path.fileExists(root))
    //   self.content = self.defaultFile()
    // else
    //   self.content = await self.addToExistingFile()

    return self
  }

  public getPath(): string {
    return this.path
  }

  public getContent(): string {
    return this.content
  }

  private defaultFile(): string {
    const content = [
      '/// <reference types="vite/client" />',
      '',
      'export {};',
      '',
      'declare global {',
      '  interface Window {',
      '    svgList: Record<SvgType | string, Promise<{ default: string }>>',
      '    importSvg: (name: SvgType | string) => Promise<{ default: string }>',
      '  }',
      '}',
      '',
      'window.svgList = svgList || {}',
      'window.importSvg = importSvg || function () {}',
      '',
    ]

    return content.join('\n')
  }

  private async addToExistingFile(): Promise<string> {
    const content = await Path.read(this.path)
    const lines = content.split('\n')

    let interfaceReady = false
    const contentFile = []

    lines.forEach((line) => {
      if (line !== 'export {}')
        contentFile.push(line)
      if (line === 'interface Window {') {
        interfaceReady = true
        contentFile.push('  svgList: Record<SvgType | string, Promise<{ default: string }>>')
        contentFile.push('  importSvg: (name: SvgType | string) => Promise<{ default: string }>')
      }
    })

    if (!interfaceReady) {
      contentFile.push('declare global {')
      contentFile.push('  interface Window {')
      contentFile.push('    svgList: Record<SvgType | string, Promise<{ default: string }>>')
      contentFile.push('    importSvg: (name: SvgType | string) => Promise<{ default: string }>')
      contentFile.push('  }')
      contentFile.push('}')
    }

    contentFile.push('')
    contentFile.push('window.svgList = svgList || {}')
    contentFile.push('window.importSvg = importSvg || function () {}')
    contentFile.push('')
    contentFile.push('export {}')

    const index = lines.findIndex(line => line === 'export {}')
    lines.splice(index, 0, ...this.content.split('\n'))

    return lines.join('\n')
  }
}
