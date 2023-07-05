declare type IconType = 'download' | 'feed/apple-podcast' | 'feed/deezer' | 'feed/google-podcast' | 'feed/overcast' | 'feed/podcast-addict' | 'feed/rss' | 'feed/spotify' | 'mail' | 'player/close' | 'player/forward' | 'player/pause' | 'player/play' | 'player/playback-x1.5' | 'player/playback-x2' | 'player/playback' | 'player/rewind' | 'player/volume-off' | 'player/volume' | 'social/facebook' | 'social/twitter' | 'social/youtube' | 'default' | 'default'
export const IconList: Record<IconType | string, Promise<{ default: string }>> = {
  'download': import('./node_modules/unplugin-svg-transformer/cache/download'),
  'feed/apple-podcast': import('./node_modules/unplugin-svg-transformer/cache/feed/apple-podcast'),
  'feed/deezer': import('./node_modules/unplugin-svg-transformer/cache/feed/deezer'),
  'feed/google-podcast': import('./node_modules/unplugin-svg-transformer/cache/feed/google-podcast'),
  'feed/overcast': import('./node_modules/unplugin-svg-transformer/cache/feed/overcast'),
  'feed/podcast-addict': import('./node_modules/unplugin-svg-transformer/cache/feed/podcast-addict'),
  'feed/rss': import('./node_modules/unplugin-svg-transformer/cache/feed/rss'),
  'feed/spotify': import('./node_modules/unplugin-svg-transformer/cache/feed/spotify'),
  'mail': import('./node_modules/unplugin-svg-transformer/cache/mail'),
  'player/close': import('./node_modules/unplugin-svg-transformer/cache/player/close'),
  'player/forward': import('./node_modules/unplugin-svg-transformer/cache/player/forward'),
  'player/pause': import('./node_modules/unplugin-svg-transformer/cache/player/pause'),
  'player/play': import('./node_modules/unplugin-svg-transformer/cache/player/play'),
  'player/playback-x1.5': import('./node_modules/unplugin-svg-transformer/cache/player/playback-x1.5'),
  'player/playback-x2': import('./node_modules/unplugin-svg-transformer/cache/player/playback-x2'),
  'player/playback': import('./node_modules/unplugin-svg-transformer/cache/player/playback'),
  'player/rewind': import('./node_modules/unplugin-svg-transformer/cache/player/rewind'),
  'player/volume-off': import('./node_modules/unplugin-svg-transformer/cache/player/volume-off'),
  'player/volume': import('./node_modules/unplugin-svg-transformer/cache/player/volume'),
  'social/facebook': import('./node_modules/unplugin-svg-transformer/cache/social/facebook'),
  'social/twitter': import('./node_modules/unplugin-svg-transformer/cache/social/twitter'),
  'social/youtube': import('./node_modules/unplugin-svg-transformer/cache/social/youtube'),
  'default': import('./node_modules/unplugin-svg-transformer/cache/default'),
}

// @ts-expect-error type is global
window.iconList = IconList
