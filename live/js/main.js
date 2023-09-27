import { importSvg } from './icons'

document.getElementById('app').innerHTML = '__UNPLUGIN__'

const icon = document.getElementById('icon')
const name = icon?.getAttribute('name')

if (name && icon)
  icon.innerHTML = await importSvg(name)
