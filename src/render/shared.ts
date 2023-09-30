import type { OptionsExtended } from '../types'

export interface LibraryType {
  ust: {
    options: OptionsExtended
    svgList: Record<SvgName, () => Promise<{ default: string }>>
    importSvg: (name: SvgName) => Promise<string>
  }
}

export type Display = 'block' | 'inline-block' | 'inline' | 'flex' | 'inline-flex' | 'none' | 'grid' | 'inline-grid' | 'contents' | 'flow' | 'flow-root' | 'table' | 'table-row' | 'table-cell' | false

export const warningSvg = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="red"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>'

export function defaultSvg(title?: string, transparent = false): string {
  const first = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">'
  // const content = '<path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />'
  const content = ''
  const last = '</svg>'

  let svg = first
  if (title) {
    const titleRender = `<title>${title}</title>`
    svg += titleRender
  }

  if (!transparent)
    svg += content

  svg += last

  return svg
}

export function ssr(title?: string): string {
  const properties = [
    'position: absolute;',
    'width: 1px;',
    'height: 1px;',
    'padding: 0;',
    'margin: -1px;',
    'overflow: hidden;',
    'clip: rect(0, 0, 0, 0);',
    'white-space: nowrap;',
    'border-width: 0;',
  ]

  return `<span style="position: relative;"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" style="${properties.join('')}">${title}</svg></span>`
}
