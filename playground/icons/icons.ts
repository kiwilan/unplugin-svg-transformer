declare type IconType = 'download' | 'social/twitter' | 'default'
export const IconList: Record<IconType | string, Promise<{ default: string }>> = {
  'download': import('./cache/download'),
  'social/twitter': import('./cache/social/twitter'),
  'default': import('./cache/default'),
}
