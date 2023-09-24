import type { App, Plugin } from 'vue'
import { VueSvg } from './VueSvg'

/**
 * Vue plugin to register the component globally.
 */
export const SvgTransformerPlugin: Plugin = {
  install: (app: App) => {
    app.component('SvgIcon', VueSvg)

    return app
  },
}

// function SvgTransformerPlugin(options: any): Plugin {
//   return {
//     install: (app: App, options: string) => {
//       app.component('SvgIcon', VueSvg)

//       return app
//     },
//   }
// }
