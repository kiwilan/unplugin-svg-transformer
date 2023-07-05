import fs, { access, rm } from 'node:fs/promises'
import { join } from 'node:path'

export class Utils {
  public static fullPath(path: string): string {
    path = this.normalizePath(path)
    return join(process.cwd(), path)
  }

  public static packagePath(dist = false): string {
    const root = process.cwd()
    const packagePath = Utils.normalizePath('./node_modules/unplugin-svg-transformer')
    if (dist)
      return join(root, packagePath, 'dist')

    return join(root, packagePath)
  }

  public static componentsPath(): string {
    const packagePath = Utils.packagePath(true)
    const componentsPath = Utils.normalizePath('./components.d.ts')

    return join(packagePath, componentsPath)
  }

  public static async read(path: string): Promise<string> {
    path = this.normalizePath(path)
    try {
      const content = await fs.readFile(path, 'utf-8')
      return content
    }
    catch (err) {
      console.error('Unable to read file:', err, path)
      return ''
    }
  }

  public static async write(path: string, content: string): Promise<boolean> {
    path = this.normalizePath(path)
    try {
      await fs.writeFile(path, content)
      return true
    }
    catch (err) {
      console.error('Unable to write file:', err, path)
    }

    return false
  }

  public static async fileExists(path: string): Promise<boolean> {
    try {
      await access(path, fs.constants.F_OK)
      return true
    }
    catch (error) {
      return false
    }
  }

  public static async rm(path: string): Promise<void> {
    path = this.normalizePath(path)
    try {
      await rm(path)
    }
    catch (err) {
      console.error('Unable to remove file:', err, path)
    }
  }

  public static async directoriesExists(icons: string, cache: string, filename: string): Promise<void> {
    await Utils.directoryExists(icons)
    await Utils.directoryExists(cache)
    const dir = filename.substring(0, filename.lastIndexOf('/'))
    await Utils.directoryExists(dir)
  }

  public static normalizePath(path: string, double = false): string {
    if (process.platform === 'win32') {
      if (double)
        return path.replace(/\\/g, '\\\\')

      return path.replace(/\//g, '\\')
    }

    return path
  }

  public static async directoryExists(path: string): Promise<boolean> {
    path = this.normalizePath(path)
    try {
      const stats = await fs.stat(path)
      return stats.isDirectory()
    }
    catch (err) {
      try {
        await fs.mkdir(path, { recursive: true })
        return true
      }
      catch (err) {
        console.error('Unable to create directory:', err, path)
        return false
      }
    }
  }

  public static async rmDirectory(path: string): Promise<void> {
    path = this.normalizePath(path)
    if (!await this.directoryExists(path))
      return

    try {
      await fs.rm(path, { recursive: true })
    }
    catch (err) {
      console.error('Unable to remove directory:', err)
    }
  }

  public static async ignorePath(path?: string, gitignorePath?: string): Promise<void> {
    if (!path)
      return

    path = this.normalizePath(path)
    gitignorePath = this.normalizePath(gitignorePath ?? '.gitignore')

    path = path.replace(process.cwd(), '')
    gitignorePath = gitignorePath?.replace(process.cwd(), '')

    gitignorePath = join(process.cwd(), gitignorePath)
    const content = await fs.readFile(gitignorePath, 'utf-8')

    if (content.includes(path))
      return

    await fs.appendFile(gitignorePath, `\n${path}`)
  }
}
