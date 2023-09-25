import React from 'react'
import ReactDOM from 'react-dom/client'
import { ReactSvg } from 'unplugin-svg-transformer/react'
import './index.css'
import './icons'

const root = document.getElementById('root') as HTMLElement
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    hello
    <ReactSvg name="download" className='icon' />
  </React.StrictMode>,
)