export interface Options {
  /**
   * Directory where your SVG files are located.
   *
   * @default './src/svg' or './assets/svg' for Nuxt
   */
  iconsDir?: string
  /**
   * File where types and list of icons will be created.
   *
   * @default './src' or './' for Nuxt
   */
  libraryDir?: string
  /**
   * Use types, if you want to use JavaScript instead of TypeScript, set this option to false.
   * You can't have autocompletion with JavaScript.
   *
   * @default true
   */
  types?: boolean
  /**
   * Inject the window object in the SVG files.
   * This is useful if you want to use the SVG files in the browser.
   *
   * You can access to this window object with `window.iconList`.
   *
   * @default true
   */
  windowInject?: boolean
  /**
   * Create `global.d.ts` file with the window object. If `windowInject` is false, this option will be ignored.
   *
   * @default true
   */
  globalType?: boolean
}

export interface OptionsExtended extends Options {
  isNuxt?: boolean
  nuxtBuildDir?: string
  nuxtLibraryDir?: string
}
