import { createApp } from 'vue'
import './style.css'
import { SvgTransformerPlugin } from 'unplugin-svg-transformer/vue'
import App from './App.vue'

createApp(App)
  .use(SvgTransformerPlugin)
  .mount('#app')
