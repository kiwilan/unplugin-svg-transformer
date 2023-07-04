import fs from 'node:fs/promises'
import { join } from 'node:path'
import type { SvgItem } from './SvgItem'

export class FileUtils {
  public static fullPath(path: string): string {
    return join(process.cwd(), path)
  }

  public static async read(path: string): Promise<string> {
    try {
      const content = await fs.readFile(path, 'utf-8')
      return content
    }
    catch (err) {
      console.error('Unable to read file:', err)
      return ''
    }
  }

  public static async write(path: string, content: string): Promise<boolean> {
    try {
      await fs.writeFile(path, content)
      return true
    }
    catch (err) {
      console.error('Unable to write file:', err)
    }

    return false
  }

  public static async writeSvgAsTs(files: SvgItem[], cacheDir: string): Promise<void> {
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

  public static async checkIfDirectoryExists(path: string): Promise<boolean> {
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
        console.error('Unable to create directory:', err)
        return false
      }
    }
  }

  public static async removeDirectory(path: string): Promise<void> {
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

    path = path.replace(process.cwd(), '')
    gitignorePath = gitignorePath?.replace(process.cwd(), '')

    gitignorePath = join(process.cwd(), gitignorePath ?? '.gitignore')
    const content = await fs.readFile(gitignorePath, 'utf-8')

    if (content.includes(path))
      return

    await fs.appendFile(gitignorePath, `\n${path}`)
  }
}
