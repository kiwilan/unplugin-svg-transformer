import { Utils } from './Utils'

export class DefinitionFile {
  protected constructor(
    protected types: string,
    protected componentType?: string,
    protected definition?: string,
  ) {}

  public static async make(types: string): Promise<DefinitionFile> {
    const self = new DefinitionFile(types)

    self.types = self.types.replace('\'default\' | \'default\'', '\'default\'')

    const contents = [
      '/* eslint-disable */',
      '/* prettier-ignore */',
      '// @ts-nocheck',
      '// Generated by unplugin-svg-transformer',
      'export {}',
      '',
      'declare global {',
      `  ${self.types}`,
      '  interface Window {',
      '    iconList: Record<IconType, Promise<{ default: string }>>',
      '  }',
      '}',
      '',
      'declare module \'vue\' {',
      '  export interface GlobalComponents {',
      '    SvgIcon: typeof import(\'unplugin-svg-transformer/components\')[\'VueSvg\']',
      '  }',
      '}',
      '',
      'window.iconList = window.iconList || {}',
      '',
    ]

    self.definition = contents.join('\n')
    self.componentType = await self.setComponentType()

    return self
  }

  public getComponentType(): string {
    return this.componentType!
  }

  public getDefinition(): string {
    return this.definition!
  }

  private async setComponentType(): Promise<string> {
    const path = Utils.componentsPath()

    if (!await Utils.fileExists(path))
      return ''

    let content = await Utils.read(path)

    content = content.replace(/type: PropType<string>;/g, 'type: PropType<IconType>;')
    content = content.replace(/name: string;/g, 'name: IconType;')

    return content
  }
}
