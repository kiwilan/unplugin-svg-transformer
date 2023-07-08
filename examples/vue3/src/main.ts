import { createApp } from 'vue'
import './style.css'
import { SvgTransformer } from '../../../src/vue'
import { IconList } from './icons'
import App from './App.vue'

createApp(App)
  .use(SvgTransformer, IconList)
  .mount('#app')
