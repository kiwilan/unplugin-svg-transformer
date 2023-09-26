import { importIcon } from './icons'

export async function setupIcon(element: HTMLElement, name: IconType) {
  const svg = await importIcon(name)
  element.innerHTML = svg.default
}
