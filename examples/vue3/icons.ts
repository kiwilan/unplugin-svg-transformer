declare type IconType = 'download' | 'social/twitter' | 'default'
export const IconList: Record<IconType | string, Promise<{ default: string }>> = {
  'download': import('./icons/cache/download'),
  'social/twitter': import('./icons/cache/social/twitter'),
  'default': import('./icons/cache/default'),
}
