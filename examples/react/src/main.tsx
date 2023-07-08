import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ReactSvg } from '../../../src/components'
import './index.css'
import './icons'

const root = document.getElementById('root') as HTMLElement
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    {/* <App /> */}
    hello
    <ReactSvg name="download" className='icon' />
  </React.StrictMode>,
)
