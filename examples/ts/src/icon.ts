import { importSvg } from './icons'

export async function setupIcon(element: HTMLElement, name: SvgType) {
  element.innerHTML = await importSvg(name)
}
