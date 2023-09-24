import { createApp } from 'vue'
import './style.css'
import { SvgTransformer } from '../../../src/vue'
// import { SvgTransformer } from '../../../dist/vue'
import App from './App.vue'
import './icons'

createApp(App)
  .use(SvgTransformer)
  .mount('#app')
