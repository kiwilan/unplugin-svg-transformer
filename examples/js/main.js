import { IconList } from './icons'

document.getElementById('app').innerHTML = '__UNPLUGIN__'

const icon = document.getElementById('icon')
const name = icon?.getAttribute('name')

if (name && icon) {
  const svg = await IconList[name]
  icon.innerHTML = svg.default
}
