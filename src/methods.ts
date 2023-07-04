import fs from 'node:fs/promises'
import path from 'node:path'

interface SvgItem {
  name: string
  path: string
  content?: string
}

export async function setup() {
  await removeDirectory(path.join(process.cwd(), './resources/js/Icons/cache'))
  const directoryPath = path.join(process.cwd(), './resources/js/Icons')
  const files = await getSvgFiles(directoryPath, directoryPath)

  let content = await typeContent(files)
  content += await listContent(files)

  write(iconTsPath(), content)

  for (const file of files)
    await writeCacheSvgFile(file)

  await addDefaultSvgToCache()
}

async function removeDirectory(path: string) {
  if (!await checkIfDirectoryExists(path))
    return

  try {
    await fs.rm(path, { recursive: true })
  }
  catch (err) {
    console.error('Unable to remove directory:', err)
  }
}

async function addDefaultSvgToCache() {
  let content = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
  content = addHeightAndWidthToSvgAsStyle(content)
  await writeCacheSvgFile({
    name: 'default',
    path: '',
    content,
  })

  return content
}

function iconTsPath() {
  const directoryPath = path.join(process.cwd(), './resources/js')
  const filePath = path.join(directoryPath, 'icons.ts')

  return filePath
}

async function getSvgFiles(directoryPath: string, rootPath: string): Promise<SvgItem[]> {
  const svgFiles: SvgItem[] = []

  const files = await fs.readdir(directoryPath)
  for (const file of files) {
    const filePath = path.join(directoryPath, file)
    const stats = await fs.stat(filePath)
    if (stats.isDirectory()) {
      const subFiles = await getSvgFiles(filePath, rootPath)
      svgFiles.push(...subFiles)
    }
    else if (path.extname(file) === '.svg') {
      let name = filePath
      name = name.replace(rootPath, '')
      name = name.replace(/\\/g, '/')
      name = name.replace(/\.svg$/, '')
      name = name.replace(/^\//, '')
      name = name.replace('/', '-')
      name = name.replace('\\', '-')

      const item: SvgItem = {
        name,
        path: filePath,
      }
      svgFiles.push(item)
    }
  }

  await Promise.all(svgFiles.map(async (item) => {
    item.content = await svgFileContent(item.path)
  }))

  return svgFiles
}

async function svgFileContent(path: string) {
  try {
    let content = await fs.readFile(path, 'utf8')
    content = modifySvgFile(content)
    content = removeBuiltInHeightAndWidth(content)
    content = addHeightAndWidthToSvgAsStyle(content)
    content = removeBreakLines(content)
    content = removeTooLargeSpaces(content)
    content = removeClasses(content)

    return content
  }
  catch (err) {
    console.error('Unable to read file:', err)
    return undefined
  }
}

function modifySvgFile(content: string): string {
  if (/fill="none"/.test(content)) {
    if (/stroke="currentColor"/.test(content))
      return content

    return content.replace(/<svg/g, '<svg stroke="currentColor"')
  }

  return content.replace(/<svg/g, '<svg fill="currentColor"')
}

function removeBuiltInHeightAndWidth(content: string) {
  return content.replace(/height=".*?"/g, '').replace(/width=".*?"/g, '')
}

function addHeightAndWidthToSvgAsStyle(content: string) {
  return content.replace(/<svg/g, '<svg style="height: inherit; width: inherit;"')
}

function removeBreakLines(content: string) {
  return content.replace(/\r?\n|\r/g, '')
}

function removeTooLargeSpaces(content: string) {
  return content.replace(/\s{2,}/g, ' ')
}

function removeClasses(content: string) {
  return content.replace(/class=".*?"/g, '')
}

async function typeContent(items: SvgItem[]) {
  let content = ''
  content += 'export type IconType = '
  items.forEach((item, key) => {
    if (key > 0)
      content += ' | '

    content += `'${item.name}'`
  })
  content += '\n'

  return content
}

async function listContent(items: SvgItem[]) {
  let content = 'export const IconList: Record<IconType | string, Promise<{ default: string }>> = {\n'
  const basePath = './Icons/cache/'

  items.forEach((item) => {
    content += `  '${item.name}': import('${basePath}${item.name}'),\n`
  })
  content += `  'default': import('${basePath}default'),\n`
  content += '}\n'

  return content
}

async function write(path: string, content: string): Promise<boolean> {
  try {
    await fs.writeFile(path, content)
    return true
  }
  catch (err) {
    console.error('Unable to write file:', err)
  }

  return false
}

async function checkIfDirectoryExists(path: string): Promise<boolean> {
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

async function writeCacheSvgFile(item: SvgItem) {
  const content = item.content

  const directoryPath = path.join(process.cwd(), './resources/js/Icons/cache')
  await checkIfDirectoryExists(directoryPath)

  const filePath = path.join(directoryPath, `${item.name}.ts`)
  const contentTs = `export default '${content}'\n`

  return write(filePath, contentTs)
}
