export type IconType = 'download' | 'social/twitter' | 'default' | 'default'
export const IconList: Record<IconType | string, Promise<{ default: string }>> = {
  'download': import('../node_modules/unplugin-svg-transformer/cache/download'),
  'social/twitter': import('../node_modules/unplugin-svg-transformer/cache/social/twitter'),
  'default': import('../node_modules/unplugin-svg-transformer/cache/default'),
}

if (typeof window !== 'undefined') {
  // @ts-expect-error type is global
  window.iconList = IconList
}
