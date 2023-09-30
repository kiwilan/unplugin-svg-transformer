/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
// Generated by unplugin-svg-transformer
export type SvgName = 'download' | 'social/twitter' | 'default'
export const svgList: Record<SvgName, () => Promise<{ default: string }>> = {
  'download': () => import('./cache/download.ts'),
  'social/twitter': () => import('./cache/social/twitter.ts'),
  'default': () => import('./cache/default.ts'),
}

export async function importSvg(name: SvgName): Promise<string> {
  if (!svgList[name])
    console.warn(`Icon ${name} not found`)
  name = svgList[name] || svgList["default"]
  const svg = await name()
  if (svg.default)
    return svg.default
  return svg
}

if (typeof window !== 'undefined') {
  window.svgList = svgList
  window.importSvg = importSvg
}