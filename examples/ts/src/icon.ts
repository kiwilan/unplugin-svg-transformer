import { IconList } from './icons'

export async function setupIcon(element: HTMLElement, name: IconType) {
  let svg = await IconList[name]
  if (!svg) {
    svg = await IconList.default
  }

  element.innerHTML = svg.default
}
