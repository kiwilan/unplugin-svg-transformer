import React, { useEffect, useState } from 'react'
import type { Display } from './shared'
import { defaultSvg } from './shared'

interface Props {
  className?: string
  style?: React.CSSProperties
  name: IconType
  display?: Display
}

function ReactSvg({ className, style, name, display }: Props): JSX.Element {
  const svgStyle: React.CSSProperties = {
    display: display || 'inline-block',
  }

  const defaultSSR = defaultSvg(name)
  const [current, setCurrent] = useState(defaultSSR)

  async function getSvg() {
    setCurrent('')
    const wd = window as any
    setCurrent(await wd.importSvg(name))
  }

  useEffect(() => {
    getSvg()
  }, [name])

  return <span className={className} style={{ ...svgStyle, ...style }} dangerouslySetInnerHTML={{ __html: current }}></span>
}

export {
  ReactSvg,
}
