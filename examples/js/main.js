import { svgList } from './icons'

document.getElementById('app').innerHTML = '__UNPLUGIN__'

const icon = document.getElementById('icon')
const name = icon?.getAttribute('name')

if (name && icon) {
  const svg = await svgList[name]
  icon.innerHTML = svg.default
}
