import fs from 'node:fs/promises'
import path from 'node:path'

export class FileUtils {
  public static getCachePath(): string {
    return path.join(process.cwd(), './resources/js/Icons/cache')
  }

  public static getIconTsPath() {
    const directoryPath = path.join(process.cwd(), './resources/js')
    const filePath = path.join(directoryPath, 'icons.ts')

    return filePath
  }

  public static getDirectoryPath(): string {
    return path.join(process.cwd(), './resources/js/Icons')
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
}
