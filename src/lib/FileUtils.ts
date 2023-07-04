import fs from 'node:fs/promises'
import { join } from 'node:path'
import type { SvgItem } from './SvgItem'

export class FileUtils {
  public static fullPath(path: string): string {
    path = this.convertDirectorySeparator(path)
    return join(process.cwd(), path)
  }

  public static async read(path: string): Promise<string> {
    path = this.convertDirectorySeparator(path)
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
    path = this.convertDirectorySeparator(path)
    try {
      await fs.writeFile(path, content)
      return true
    }
    catch (err) {
      console.error('Unable to write file:', err, path)
    }

    return false
  }

  public static async writeSvgAsTs(files: SvgItem[], cacheDir: string): Promise<void> {
    cacheDir = this.convertDirectorySeparator(cacheDir)
    await Promise.all(files.map(async (file) => {
      let path = file.getPath()
      path = `${cacheDir}${path}`
      path = path.replace('.svg', '.ts')

      const dir = path.substring(0, path.lastIndexOf('/'))
      await FileUtils.checkIfDirectoryExists(dir)

      let content = file.getContent()
      content = `export default '${content}'\n`

      await FileUtils.write(path, content)
    }))
  }

  public static async checkIfDirectoriesExists(icons: string, cache: string, filename: string): Promise<void> {
    await FileUtils.checkIfDirectoryExists(icons)
    await FileUtils.checkIfDirectoryExists(cache)
    const dir = filename.substring(0, filename.lastIndexOf('/'))
    await FileUtils.checkIfDirectoryExists(dir)
  }

  public static convertDirectorySeparator(path: string): string {
    if (process.platform === 'win32')
      return path.replace(/\//g, '\\')

    return path
  }

  public static async checkIfDirectoryExists(path: string): Promise<boolean> {
    path = this.convertDirectorySeparator(path)
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

  public static async removeDirectory(path: string): Promise<void> {
    path = this.convertDirectorySeparator(path)
    if (!await this.checkIfDirectoryExists(path))
      return

    try {
      await fs.rm(path, { recursive: true })
    }
    catch (err) {
      console.error('Unable to remove directory:', err)
    }
  }

  public static async addPathToGitignoreIfNotExists(path?: string, gitignorePath?: string): Promise<void> {
    if (!path)
      return

    path = this.convertDirectorySeparator(path)
    gitignorePath = this.convertDirectorySeparator(gitignorePath ?? '.gitignore')

    path = path.replace(process.cwd(), '')
    gitignorePath = gitignorePath?.replace(process.cwd(), '')

    gitignorePath = join(process.cwd(), gitignorePath)
    const content = await fs.readFile(gitignorePath, 'utf-8')

    if (content.includes(path))
      return

    await fs.appendFile(gitignorePath, `\n${path}`)
  }
}
