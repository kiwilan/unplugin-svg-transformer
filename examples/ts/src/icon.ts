import { importSvg } from '../icons'

export async function setupIcon(element: HTMLElement, name: SvgName) {
  element.innerHTML = await importSvg(name)
}
