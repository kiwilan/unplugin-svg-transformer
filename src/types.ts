export interface NuxtOptions {
  /**
   * Directory where your SVG files are located.
   *
   * @default './assets/svg'
   */
  iconsDir?: string
}

export interface Options {
  /**
   * Directory where your SVG files are located.
   *
   * @default './src/svg'
   */
  iconsDir?: string
  /**
   * File where types and list of icons will be created.
   *
   * @default './src'
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
   * For Vite users, this option is already enabled by `vite-env.d.ts` file.
   *
   * Create `global.d.ts` file at the root of your project. Make sure to add this file in your `tsconfig.json` file.
   *
   * ```json
   * {
   *  "include": [
   *    "global.d.ts"
   *  ]
   * }
   * ```
   *
   * Inject `iconList` and `importIcon()` in the window object: `window.iconList` and `window.importIcon()`.
   * These methods are fully typed.
   *
   * @default false
   */
  globalTypes?: boolean
  // /**
  //  * Inject the window object in the SVG files.
  //  * This is useful if you want to use the SVG files in the browser.
  //  *
  //  * You can access to this window object with `window.iconList`.
  //  *
  //  * @default true
  //  */
  // windowInject?: boolean
  // /**
  //  * Create `global.d.ts` file with the window object. If `windowInject` is false, this option will be ignored.
  //  *
  //  * @default true
  //  */
  // globalType?: boolean
}

export interface OptionsExtended extends Options {
  isNuxt?: boolean
  nuxtDir?: string
}
