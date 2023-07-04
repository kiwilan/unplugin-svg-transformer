import type { PluginOption } from 'vite'

export default function vitePluginSvg(): PluginOption {
  return {
    // plugin name
    name: 'vite-plugin-svg',

    // pre will be executed before post
    enforce: 'pre', // post

    // Indicate that they are only called in 'build' or 'serve' mode
    apply: 'build', // apply can also be a function

    config(config, { command }) {
      console.log('here is the config hook')
    },

    configResolved(resolvedConfig) {
      console.log('here is the configResolved hook')
    },

    configureServer(server) {
      console.log('here is the configureServer hook')
    },

    transformIndexHtml(html) {
      console.log('here is the transformIndexHtml hook')
    },
  }
}
