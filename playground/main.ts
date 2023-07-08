import { IconList } from './icons'

document.getElementById('app')!.innerHTML = '__UNPLUGIN__'

const icon = document.getElementById('icon')
const name: IconType = icon?.getAttribute('name') as IconType

if (name && icon) {
  const svg = await IconList[name]
  icon.innerHTML = svg.default
}
