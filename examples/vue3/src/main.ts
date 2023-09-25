import { createApp } from 'vue'
import './style.css'
import { SvgTransformerPlugin } from '../../../src/vue'
import App from './App.vue'
import './icons'

createApp(App)
  .use(SvgTransformerPlugin)
  .mount('#app')
