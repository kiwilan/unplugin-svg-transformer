export interface Options {
  /**
   * Directory where the SVG files are located.
   *
   * @default './src/icons'
   */
  iconsDir?: string
  /**
   * File where the types and list of icons will be created.
   *
   * @default './src/icons.ts'
   */
  libraryDir?: string
  /**
   * Path to the .gitignore file.
   *
   * @default './.gitignore'
   */
  gitignorePath?: string
  /**
   * Use TypeScript or not, if you want to use JavaScript instead of TypeScript.
   * You can't have autocompletion with JavaScript.
   *
   * @default true
   */
  typescript?: boolean
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

export interface OptionsExtended extends Options {}
