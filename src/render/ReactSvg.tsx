import React, { useEffect, useState } from 'react'
import type { Display } from './shared'
import { defaultSvg } from './shared'

interface Props {
  className?: string
  style?: React.CSSProperties
  name: IconType
  display?: Display
}

// function ReactSvg({ name: _name, display = 'inline-block' }: { name: string; display?: string | false }) {

//   const attributes = useRef({ style: {} }).current

//   if (display !== false) {
//     attributes.style = {
//       display,
//     }
//   }

//   // return <span {...attributes} dangerouslySetInnerHTML={{ __html: current }} />
//   return <div>{_name}</div>
// }

function ReactSvg({ className, style, name, display }: Props): JSX.Element {
  const svgStyle: React.CSSProperties = {
    display: display || 'inline-block',
    // color: 'red',
    // fontSize: '24px',
  }

  const defaultSSR = defaultSvg(name)
  const [current, setCurrent] = useState(defaultSSR)

  async function getSvg() {
    const wd = window as any
    const svg = await wd.importIcon(name)
    setCurrent(svg.default)
  }

  useEffect(() => {
    getSvg()
  }, [name])

  return <span className={className} style={{ ...svgStyle, ...style }} dangerouslySetInnerHTML={{ __html: current }}></span>
}

export {
  ReactSvg,
}
