import type { Plugin } from 'vite'

// import { createApp } from 'vue'
// import MyComponent from './components/MyComponent.vue'
// import { setup } from './methods'

export default function svgPlugin(options: MyPluginOptions): Plugin {
  // const app = createApp(MyComponent)
  // app.mount('#app')

  return {
    name: 'svg-plugin',
    async buildStart() {
      // const opts: Options = Object.assign({}, DEFAULT_OPTIONS, userOptions)
      // await setup()
    },
    handleHotUpdate({ file, server }) {
      if (file.endsWith('.svg'))
        server.restart()
    },
  }
}

interface MyPluginOptions {
  // Add your plugin options here
}
