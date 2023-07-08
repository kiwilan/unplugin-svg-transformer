export type IconType = 'svg/download' | 'svg/social/twitter' | 'default' | 'default'
export const IconList: Record<IconType | string, Promise<{ default: string }>> = {
  'svg/download': import('./node_modules/unplugin-svg-transformer/cache/svg/download'),
  'svg/social/twitter': import('./node_modules/unplugin-svg-transformer/cache/svg/social/twitter'),
  'default': import('./node_modules/unplugin-svg-transformer/cache/default'),
}

if (typeof window !== 'undefined') {
  // @ts-expect-error type is global
  window.iconList = IconList
}
