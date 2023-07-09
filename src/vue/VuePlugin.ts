import type { App, Plugin } from 'vue'
import { VueSvg } from '../component/Vue'

export const SvgTransformer: Plugin = {
  install: (app: App) => {
    app.component('SvgIcon', VueSvg)

    return app
  },
}
