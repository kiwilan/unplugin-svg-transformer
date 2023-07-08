import type { App, Plugin } from 'vue'
import SvgIcon from './SvgIcon'

// export const svgTransformer: Plugin = {
//   install: async (app, options) => {
//     console.log(options)
//     // const config = await Utils.getViteConfig()
//     // const iconsFile = await import(config.writer.libraryDir)
//     // const path = './icons'
//     // const iconsFile = await import(path)

//     app.component('SvgIcon', SvgIcon)

//     return app
//   },
// }

// interface SvgTransformerPluginOptions {
//   list: Record<any, Promise<{ default: string }>>
// }

// interface MyGlobalProperties {
//   $icons: Record<any, Promise<{ default: string }>>
// }

// declare module '@vue/runtime-core' {
//   interface App extends MyGlobalProperties {}
// }

// @ts-expect-error missing types
interface SvgTransformerPlugin extends Plugin {
  // install: (app: App, options: SvgTransformerPluginOptions) => void
  install: (app: App, options: Record<any, Promise<{ default: string }>>) => void
}

export const SvgTransformer: SvgTransformerPlugin = {
  install: (app, options) => {
    app.component('SvgIcon', SvgIcon)
    app.provide('$icons', options.list)

    return app
  },
}
