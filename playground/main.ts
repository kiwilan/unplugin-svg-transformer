import { importSvg } from './icons'

document.getElementById('app')!.innerHTML = '__UNPLUGIN__'

const icon = document.getElementById('icon')
const iconName: SvgType = icon?.getAttribute('name') as SvgType

if (iconName && icon)
  importSvg(iconName).then(svg => icon.innerHTML = svg)
