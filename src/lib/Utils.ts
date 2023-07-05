import fs, { access, rm } from 'node:fs/promises'
import { join } from 'node:path'

interface PackagePathOpts {
  dist?: boolean
  path?: string
}

interface ViteConfig {
  origin: {
    iconsDir: string
    cacheDir: string
    filenamePath: string
    gitignorePath: string
  }
  writer: {
    iconsDir: string
    cacheDir: string
    filenamePath: string
    gitignorePath: string
  }
}

export class Utils {
  public static fullPath(path: string): string {
    path = this.normalizePath(path)
    return join(process.cwd(), path)
  }

  public static rootPath(path?: string): string {
    const root = process.cwd()

    if (path)
      return Utils.normalizePath(join(root, path))

    return root
  }

  public static relativeToRoot(path: string): string {
    const root = process.cwd()
    path = Utils.normalizePath(path)

    return path.replace(root, '')
  }

  public static viteConfig(): string {
    const path = Utils.packagePath({ path: 'config.json' })
    return path
  }

  public static async getViteConfig(): Promise<ViteConfig> {
    const content = await Utils.read(Utils.viteConfig())

    return JSON.parse(content) as ViteConfig
  }

  public static packagePath(opts: PackagePathOpts = { dist: true }): string {
    const root = process.cwd()
    const packagePath = 'node_modules/unplugin-svg-transformer'
    const dist = opts.dist ? 'dist' : ''
    const optsPath = opts.path ?? ''
    let path = join(root, packagePath, dist, optsPath)
    path = Utils.normalizePath(path)

    return path
  }

  public static componentsPath(): string {
    const packagePath = Utils.packagePath()
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
      await rm(path, { force: true })
    }
    catch (err) {
      console.error('Unable to remove file:', err, path)
    }
  }

  private static normalizePath(path: string): string {
    path = path.replace(/\/\//g, '/')

    if (process.platform === 'win32')
      return path.replace(/\//g, '\\')

    return path
  }

  public static normalizePaths(paths: string[] | string): string {
    if (typeof paths === 'string')
      return this.normalizePath(paths)

    let path = paths.map(path => this.normalizePath(path)).join('/')
    path = path.replace(/\/\//g, '/')

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
