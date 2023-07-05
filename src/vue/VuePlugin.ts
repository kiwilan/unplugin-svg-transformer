import type { Plugin } from 'vue'
import SvgIcon from './SvgIcon'

export const svgTransformer: Plugin = {
  install: async (app) => {
    // const config = await Utils.getViteConfig()
    // const iconsFile = await import(config.writer.filenamePath)
    // const path = './icons'
    // const iconsFile = await import(path)

    // const list: Record<string, Promise<{ default: string }>> = iconsFile.IconList || {}
    // app.config.globalProperties.$icons = list

    // app.provide('inertia', {
    //   route: app.config.globalProperties.$route,
    // })

    app.component('SvgIcon', SvgIcon)

    return app
  },
}
