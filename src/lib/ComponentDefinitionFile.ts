import { Utils } from './Utils'
import defaultDefinition from './Definition/component'

/**
 * To create component definition file.
 */
export class ComponentDefinitionFile {
  protected constructor(
    protected contents?: string,
  ) {}

  public static async make(types: string): Promise<ComponentDefinitionFile> {
    const self = new ComponentDefinitionFile()

    self.contents = ''
    const path = Utils.componentsPath()
    const isExists = await Utils.fileExists(path)

    if (isExists) {
      const file = await Utils.read(path)
      self.contents = file === '' ? defaultDefinition : file
    }
    else { self.contents = defaultDefinition }

    if (self.contents.includes('type IconType'))
      self.contents = self.contents.replace(/type IconType = '(.*)'/g, types)
    else
      self.contents = self.contents.replace('import React from \'react\';', `import React from 'react';\n\n${types};`)

    self.contents = self.contents.replace(/type: PropType<string>;/g, 'type: PropType<IconType>;')
    self.contents = self.contents.replace(/name: string;/g, 'name: IconType;')

    return self
  }

  public getContents(): string {
    return this.contents!
  }
}
