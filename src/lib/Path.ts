import fs, { access, readdir, rm, symlink } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'
import type { Options, OptionsExtended } from '../types'

interface PackagePathOpts {
  dist?: boolean
  path?: string
}

interface ViteConfig {
  origin: {
    svgDir: string
    libraryDir: string
  }
  writer: {
    svgDir: string
    libraryDir: string
  }
}

export class Path {
  public static fullPath(path: string): string {
    path = this.normalizePath(path)
    return join(process.cwd(), path)
  }

  public static rootPath(path?: string): string {
    const root = process.cwd()

    if (path)
      return Path.normalizePath(join(root, path))

    return root
  }

  public static convertOptions(defaultOptions: OptionsExtended, options?: Options): OptionsExtended {
    const opts: OptionsExtended = Object.assign({}, defaultOptions, options)
    opts.svgDir = Path.fullPath(opts.svgDir || defaultOptions.svgDir!)
    opts.libraryDir = Path.fullPath(opts.libraryDir || defaultOptions.libraryDir!)
    opts.cacheDir = Path.fullPath(opts.cacheDir || defaultOptions.cacheDir!)
    // opts.gitignorePath = Path.fullPath(opts.gitignorePath || defaultOptions.gitignorePath!)

    return opts
  }

  public static async findNodeModules(): Promise<string> {
    const root = process.cwd()
    let currentDir = root
    while (currentDir !== '/') {
      const nodeModulesDir = join(currentDir, 'node_modules')
      if (await Path.existsAsync(nodeModulesDir))
        return nodeModulesDir

      currentDir = dirname(currentDir)
    }

    return `${root}/node_modules`
  }

  public static async existsAsync(path: string): Promise<boolean> {
    try {
      await access(path)
      return true
    }
    catch (error) {
      return false
    }
  }

  public static relativeToRoot(path: string): string {
    const root = process.cwd()
    path = Path.normalizePath(path)

    return path.replace(root, '')
  }

  public static async relativeToNodeModules(path: string): Promise<string> {
    const nodeModulesPath = await Path.findNodeModules()
    let commonPrefix = ''
    for (let i = 0; i < Math.min(path.length, nodeModulesPath.length); i++) {
      if (path[i] === nodeModulesPath[i])
        commonPrefix += path[i]

      else
        break
    }

    const fullPath = path.replace(commonPrefix, '').trim()

    let content = ''
    if (fullPath === '') {
      content = './node_modules'
    }
    else {
      const parts = fullPath.split('/')

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i]
        if (part === '')
          continue

        content += '../'
      }

      content += 'node_modules'
    }

    return `${content}/unplugin-svg-transformer/cache`
  }

  public static async listDirectories(path: string): Promise<string[]> {
    path = Path.normalizePath(path)
    const directories: string[] = []

    try {
      const files = await readdir(path)
      for (const file of files) {
        const filePath = join(path, file)
        const stats = await fs.stat(filePath)
        if (stats.isDirectory())
          directories.push(file)
      }
    }
    catch (err) {
      // console.error('Unable to list directories:', err, path)
    }

    return directories
  }

  public static viteConfig(): string {
    const path = Path.packagePath({ path: 'config.json' })
    return path
  }

  public static async getViteConfig(): Promise<ViteConfig> {
    const content = await Path.read(Path.viteConfig())

    return JSON.parse(content) as ViteConfig
  }

  public static packagePath(opts: PackagePathOpts = { dist: true }): string {
    const root = process.cwd()
    const packagePath = 'node_modules/unplugin-svg-transformer'
    const dist = opts.dist ? 'dist' : ''
    const optsPath = opts.path ?? ''
    let path = join(root, packagePath, dist, optsPath)
    path = Path.normalizePath(path)

    return path
  }

  public static componentsPath(filepath: string): string {
    const packagePath = Path.packagePath()
    const componentsPath = Path.normalizePath(filepath)

    return join(packagePath, componentsPath)
  }

  public static async read(path: string): Promise<string> {
    path = this.normalizePath(path)
    try {
      const content = await fs.readFile(path, 'utf-8')
      return content
    }
    catch (err) {
      // console.error('Unable to read file:', err, path)
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
      // console.error('Unable to write file:', err, path)
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
    // if (await Path.isDirectory(path))
    //   return

    if (!await Path.fileExists(path))
      return

    try {
      await rm(path, { force: true })
    }
    catch (err) {
      // console.error('Unable to remove file:', err, path)
    }
  }

  public static async isDirectory(path: string): Promise<boolean> {
    path = this.normalizePath(path)
    try {
      const stats = await fs.stat(path)
      return stats.isDirectory()
    }
    catch (err) {
      // console.error('Unable to check if directory:', err, path)
      return false
    }
  }

  private static normalizePath(path?: string): string {
    if (!path)
      return ''

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

  public static async ensureDirectoryExists(path: string): Promise<boolean> {
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
        // console.error('Unable to create directory:', err, path)
        return false
      }
    }
  }

  public static async deleteDirectory(path: string): Promise<void> {
    path = this.normalizePath(path)
    if (!await this.ensureDirectoryExists(path))
      return

    try {
      await fs.rm(path, { recursive: true })
    }
    catch (err) {
      // console.error('Unable to remove directory:', err)
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

  public static async appendLineIfNotExists(filePath: string, line: string): Promise<void> {
    const content = await fs.readFile(filePath, 'utf-8')
    if (content.includes(line))
      return

    await fs.appendFile(filePath, `${line}\n`)
  }

  public static async copyRecursive(src: string, dest: string): Promise<void> {
    src = this.normalizePath(src)
    dest = this.normalizePath(dest)

    const stats = await fs.stat(src)
    if (stats.isDirectory()) {
      await fs.mkdir(dest, { recursive: true })
      const files = await fs.readdir(src)
      for (const file of files) {
        const srcFile = join(src, file)
        const destFile = join(dest, file)
        await Path.copyRecursive(srcFile, destFile)
      }
    }
    else {
      await fs.copyFile(src, dest)
    }
  }

  public static async copy(src: string, dest: string): Promise<void> {
    src = this.normalizePath(src)
    dest = this.normalizePath(dest)

    await fs.copyFile(src, dest)
  }

  public static async symLink(target: string, link: string): Promise<void> {
    target = Path.normalizePaths(target)
    link = Path.normalizePaths(link)

    if (await Path.fileExists(link))
      return

    try {
      await symlink(target, link)
    }
    catch (error) {
      // console.error(error)
    }
  }

  public static relativePath(fromPath: string, toPath: string): string {
    const relativePath = relative(dirname(fromPath), toPath)
    return relativePath.startsWith('.') ? relativePath : `./${relativePath}`
  }
}
