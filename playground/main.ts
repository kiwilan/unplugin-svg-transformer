import { importIcon } from './icons'

document.getElementById('app')!.innerHTML = '__UNPLUGIN__'

const icon = document.getElementById('icon')
const iconName: IconType = icon?.getAttribute('name') as IconType

if (iconName && icon)
  importIcon(iconName).then(svg => icon.innerHTML = svg.default)
