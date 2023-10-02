import React, { useEffect, useState } from 'react'
import type { LibraryType } from './shared'
import { defaultSvg, warningSvg } from './shared'

interface Props {
  className?: string
  style?: React.CSSProperties
  name: SvgName
  title?: string
}

function ReactSvg({ className, style, name, title }: Props): JSX.Element {
  const defaultSSR = defaultSvg(name)
  const [current, setCurrent] = useState(defaultSSR)

  function fetchIcon() {
    setCurrent('')
    const wd = window as unknown as LibraryType
    if (!wd || !wd.ust || !wd.ust.importSvg) {
      setCurrent(warningSvg)
      console.warn('[unplugin-svg-transformer] Error: window.importSvg is not defined, you should import `unplugin-svg-transformer/icons` into your main file.')

      return
    }

    wd.ust.importSvg(name).then((svg: string) => setCurrent(svg))
  }

  useEffect(() => {
    fetchIcon()
  }, [name])

  return <span title={title} className={className} style={{ ...style }} dangerouslySetInnerHTML={{ __html: current }}></span>
}

export {
  ReactSvg,
}
