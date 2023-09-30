import React, { useEffect, useState } from 'react'
import type { Display, LibraryType } from './shared'
import { defaultSvg, warningSvg } from './shared'

interface Props {
  className?: string
  style?: React.CSSProperties
  name: SvgName
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
    const wd = window as unknown as LibraryType
    if (!wd || !wd.ust || !wd.ust.importSvg) {
      setCurrent(warningSvg)
      console.warn('[unplugin-svg-transformer] Error: window.importSvg is not defined, you should import `unplugin-svg-transformer/icons` into your main file.')

      return
    }
    setCurrent(await wd.ust.importSvg(name))
  }

  useEffect(() => {
    getSvg()
  }, [name])

  return <span className={className} style={{ ...svgStyle, ...style }} dangerouslySetInnerHTML={{ __html: current }}></span>
}

export {
  ReactSvg,
}
