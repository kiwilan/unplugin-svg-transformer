import type { App, Plugin } from 'vue'
import { VueSvg } from './SvgIcon'

export const SvgTransformer: Plugin = {
  install: (app: App) => {
    app.component('SvgIcon', VueSvg)

    return app
  },
}
