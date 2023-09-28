import { importSvg } from './icons'

document.getElementById('app')!.innerHTML = '__UNPLUGIN__'

const icon = document.getElementById('icon')
const iconName: SvgName = icon?.getAttribute('name') as SvgName

if (iconName && icon)
  importSvg(iconName).then(svg => icon.innerHTML = svg)
