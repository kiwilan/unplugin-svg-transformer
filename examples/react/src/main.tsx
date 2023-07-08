import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { SvgIconReact } from '../../../dist/components'
import './index.css'
import './icons'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <SvgIconReact name="download" />
  </React.StrictMode>,
)
