import React from 'react'
import ReactDOM from 'react-dom/client'
import { ReactSvg } from '../../../dist/react'

// import { ReactSvg } from '../../../dist/react'
// import { ReactSvg } from 'unplugin-svg-transformer/dist/components'
import './index.css'
import './icons'

const root = document.getElementById('root') as HTMLElement
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    hello
    <ReactSvg name="download" className='icon' />
  </React.StrictMode>,
)
