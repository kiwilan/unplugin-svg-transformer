import { iconList } from './icons'

document.getElementById('app').innerHTML = '__UNPLUGIN__'

const icon = document.getElementById('icon')
const name = icon?.getAttribute('name')

if (name && icon) {
  const svg = await iconList[name]
  icon.innerHTML = svg.default
}
