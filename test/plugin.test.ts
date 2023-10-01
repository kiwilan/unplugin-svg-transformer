import { expect, it } from 'vitest'
import { SvgCollection } from '../src/lib/Svg/SvgCollection'
import { Path } from '../src/lib/Path'
import { SvgTransformer } from '../src/lib'
import { getPaths } from './methods'

it('can parse and transform svg files', async () => {
  const iconsPath = Path.rootPath('test/icons')
  const collect = await SvgCollection.make({ svgDir: iconsPath }, getPaths().svgDir)
  const twitter = collect.getItems().find(item => item.getFilename() === 'twitter')

  expect(collect.getItems().length).toBe(23)

  expect(twitter?.getFilename()).toBe('twitter')
  expect(twitter?.getBasename()).toBe('twitter.svg')
  expect(twitter?.getName()).toBe('social/twitter')
  expect(twitter?.getTitle()).toBe('Twitter')
  expect(twitter?.getPath()).toBe(Path.normalizePaths('/social/twitter.svg'))
  expect(twitter?.getFullPath().includes(Path.normalizePaths('/test/icons/social/twitter.svg'))).toBe(true)
  expect(twitter?.getContents()).toBe('<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Twitter</title><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>')
})

it('can write svg as ts files', async () => {
  const paths = getPaths()
  const writer = await SvgTransformer.make({
    svgDir: paths.svgDir,
    libraryDir: paths.libraryDir,
    cacheDir: paths.cacheDir,
    useTypes: true,
    // windowInject: true,
  })

  expect(typeof writer).toBe('object')
  //   const files = await SvgItem.toList(getPaths().svgDir)
  //   await SvgItem.listToTsFiles(files, getPaths().cacheDir)

  //   const path = './test/icons/cache/social/twitter.ts'
  //   const content = await Path.read(path)

//   expect(content).toBe('export default \'<svg style="display: inline-block; height: inherit; width: inherit;" fill="currentColor" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Twitter</title><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>\'\n')
})

// it('can create the icons file', async () => {
//   const files = await SvgItem.toList(getPaths().svgDir)
//   await DefinitionFile.make()
//   await IconListFile.make(files, getPaths().svgDir, getPaths().cacheDir, getPaths().libraryDir)

//   const path = './test/icons/icons.ts'
//   const content = await Path.read(path)

//   if (process.platform === 'win32') {
//     expect(content).toBe(`declare type SvgName = 'download' | 'feed-apple-podcast' | 'feed-deezer' | 'feed-google-podcast' | 'feed-overcast' | 'feed-podcast-addict' | 'feed-rss' | 'feed-spotify' | 'mail' | 'player-close' | 'player-forward' | 'player-pause' | 'player-play' | 'player-playback-x1-5' | 'player-playback-x2' | 'player-playback' | 'player-rewind' | 'player-volume-off' | 'player-volume' | 'social-facebook' | 'social-twitter' | 'social-youtube' | 'default'
// export const svgList: Record<SvgName | string, Promise<{ default: string }>> = {
//   'download': import('.\\\\cache\\\\download'),
//   'feed-apple-podcast': import('.\\\\cache\\\\feed\\\\apple-podcast'),
//   'feed-deezer': import('.\\\\cache\\\\feed\\\\deezer'),
//   'feed-google-podcast': import('.\\\\cache\\\\feed\\\\google-podcast'),
//   'feed-overcast': import('.\\\\cache\\\\feed\\\\overcast'),
//   'feed-podcast-addict': import('.\\\\cache\\\\feed\\\\podcast-addict'),
//   'feed-rss': import('.\\\\cache\\\\feed\\\\rss'),
//   'feed-spotify': import('.\\\\cache\\\\feed\\\\spotify'),
//   'mail': import('.\\\\cache\\\\mail'),
//   'player-close': import('.\\\\cache\\\\player\\\\close'),
//   'player-forward': import('.\\\\cache\\\\player\\\\forward'),
//   'player-pause': import('.\\\\cache\\\\player\\\\pause'),
//   'player-play': import('.\\\\cache\\\\player\\\\play'),
//   'player-playback-x1-5': import('.\\\\cache\\\\player\\\\playback-x1.5'),
//   'player-playback-x2': import('.\\\\cache\\\\player\\\\playback-x2'),
//   'player-playback': import('.\\\\cache\\\\player\\\\playback'),
//   'player-rewind': import('.\\\\cache\\\\player\\\\rewind'),
//   'player-volume-off': import('.\\\\cache\\\\player\\\\volume-off'),
//   'player-volume': import('.\\\\cache\\\\player\\\\volume'),
//   'social-facebook': import('.\\\\cache\\\\social\\\\facebook'),
//   'social-twitter': import('.\\\\cache\\\\social\\\\twitter'),
//   'social-youtube': import('.\\\\cache\\\\social\\\\youtube'),
//   'default': import('.\\\\cache\\\\default'),
// }\n`)
//   }
//   else {
//     expect(content).toBe(`declare type SvgName = 'download' | 'feed/apple-podcast' | 'feed/deezer' | 'feed/google-podcast' | 'feed/overcast' | 'feed/podcast-addict' | 'feed/rss' | 'feed/spotify' | 'mail' | 'player/close' | 'player/forward' | 'player/pause' | 'player/play' | 'player/playback-x1.5' | 'player/playback-x2' | 'player/playback' | 'player/rewind' | 'player/volume-off' | 'player/volume' | 'social/facebook' | 'social/twitter' | 'social/youtube' | 'default'
// export const svgList: Record<SvgName | string, Promise<{ default: string }>> = {
//   'download': import('./cache/download'),
//   'feed/apple-podcast': import('./cache/feed/apple-podcast'),
//   'feed/deezer': import('./cache/feed/deezer'),
//   'feed/google-podcast': import('./cache/feed/google-podcast'),
//   'feed/overcast': import('./cache/feed/overcast'),
//   'feed/podcast-addict': import('./cache/feed/podcast-addict'),
//   'feed/rss': import('./cache/feed/rss'),
//   'feed/spotify': import('./cache/feed/spotify'),
//   'mail': import('./cache/mail'),
//   'player/close': import('./cache/player/close'),
//   'player/forward': import('./cache/player/forward'),
//   'player/pause': import('./cache/player/pause'),
//   'player/play': import('./cache/player/play'),
//   'player/playback-x1.5': import('./cache/player/playback-x1.5'),
//   'player/playback-x2': import('./cache/player/playback-x2'),
//   'player/playback': import('./cache/player/playback'),
//   'player/rewind': import('./cache/player/rewind'),
//   'player/volume-off': import('./cache/player/volume-off'),
//   'player/volume': import('./cache/player/volume'),
//   'social/facebook': import('./cache/social/facebook'),
//   'social/twitter': import('./cache/social/twitter'),
//   'social/youtube': import('./cache/social/youtube'),
//   'default': import('./cache/default'),
// }\n`)
//   }
// })
