import { Path } from '../Path'

interface DefinitionContentFile {
  contents: string
  path: string
  pathCJS: string
}

/**
 * To create component definition file.
 */
export class ComponentDefinitionFile {
  protected constructor(
    protected types: string,
    protected vue: DefinitionContentFile = {
      contents: '',
      path: '',
      pathCJS: '',
    },
    protected react: DefinitionContentFile = {
      contents: '',
      path: '',
      pathCJS: '',
    },
  ) {}

  public static async make(types: string): Promise<ComponentDefinitionFile> {
    const self = new ComponentDefinitionFile(types)

    await self.replace('vue.d.ts', 'vue')
    await self.replace('react.d.ts', 'react')

    return self
  }

  private async replace(file: string, type: 'vue' | 'react'): Promise<string> {
    const path = Path.componentsPath(file)
    if (!await Path.fileExists(path))
      return ''

    const fileContents = await Path.read(path)
    let contents = fileContents

    if (contents.includes('type SvgName'))
      contents = contents.replace(/type SvgName = '(.*)'/g, this.types)
    else
      contents = contents.replace('import React from \'react\';', `import React from 'react';\n\n${this.types};`)

    contents = contents.replace(/type: PropType<string>;/g, 'type: PropType<SvgName>;')
    contents = contents.replace(/name: string;/g, 'name: SvgName;')

    this[type] = {
      contents,
      path,
      pathCJS: path.replace(/\.ts$/, '.cts'),
    }

    return contents
  }

  public async write(): Promise<void> {
    const promises = [
      Path.write(this.vue.path, this.vue.contents),
      Path.write(this.vue.pathCJS, this.vue.contents),
      Path.write(this.react.path, this.react.contents),
      Path.write(this.react.pathCJS, this.react.contents),
    ]

    await Promise.all(promises)
  }

  public getVue(): DefinitionContentFile {
    return this.vue
  }

  public getReact(): DefinitionContentFile {
    return this.react
  }
}
