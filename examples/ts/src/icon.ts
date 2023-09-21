import { importIcon } from './icons'

export async function setupIcon(element: HTMLElement, name: IconType) {
  let svg = await importIcon(name)
  element.innerHTML = svg.default
}
