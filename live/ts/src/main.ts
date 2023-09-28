import './style.css'
import type { SvgName as SvgTyped } from 'unplugin-svg-transformer/icons'
import { importSvg, svgList } from 'unplugin-svg-transformer/icons'

console.warn(svgList)
const svg: SvgTyped = 'vue-2'
const svgGlobal: SvgName = 'vue-2'

svgList.vue().then((res) => {
  console.warn(res.default)
})
console.warn(svg)
console.warn(svgGlobal)
importSvg(svg).then((res) => {
  document.getElementById('app')!.innerHTML = res
})
