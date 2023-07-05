import { createApp } from 'vue'
import './style.css'
import { SvgIcon } from 'unplugin-svg-transformer/components'
import App from './App.vue'

createApp(App)
  .component('SvgIcon', SvgIcon)
  .mount('#app')
