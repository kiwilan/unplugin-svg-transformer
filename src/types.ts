export interface NuxtOptions extends Options {
  /**
   * Directory where your SVG files are located.
   *
   * @default './assets/svg'
   */
  svgDir?: string
}

export interface Options {
  /**
   * Default SVG displayed when the SVG is not found.
   *
   * @default
   * ```html
   * <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
   * ```
   */
  fallback?: string
  /**
   * SVG will be rendered as a string, so it's possible to add custom attributes.
   */
  svg?: {
    /**
     * Add default classes to all SVG.
     *
     * @default undefined
     */
    classDefault?: string[]
    /**
     * Clear `width` and `height` attributes from SVG (can be all, just parent on `<svg>` or none).
     *
     * @default `none`
     */
    clearSize?: 'all' | 'parent' | 'none'
    /**
     * Clear classes from SVG (can be all, just parent on `<svg>` or none).
     *
     * @default `none`
     */
    clearClass?: 'all' | 'parent' | 'none'
    /**
     * Clear inline styles from SVG (can be all, just parent on `<svg>` or none).
     *
     * @default `none`
     */
    clearStyle?: 'all' | 'parent' | 'none'
    /**
     * Add `fill="currentColor"` or `stroke="currentColor"` to all SVG.
     *
     * Engine will try to detect if the SVG is a stroke or a fill.
     *
     * @default false
     */
    currentColor?: boolean
    /**
     * Add default inline style to all SVG.
     *
     * @default undefined
     */
    inlineStyleDefault?: string[]
    /**
     * Global options to toggle size inheritance, inline style `height: inherit; width: inherit;`.
     *
     * @default false
     */
    sizeInherit?: boolean
    /**
     * Add title to SVG string.
     *
     * @example
     * ```html
     * <svg><title>svg-name</title></svg>
     * ```
     *
     * @default false
     */
    title?: boolean
  }
  /**
   * Trigger a warning when the SVG is not found.
   *
   * @default true
   */
  warning?: boolean
}

export interface PluginOptions extends Options {
  /**
   * SVG files will be added to cache directory.
   *
   * By default, cache is into `node_modules/unplugin-svg-components/cache`.
   * But in some cases, you may want to change this directory.
   *
   * @default './node_modules/unplugin-svg-components/cache'
   */
  cacheDir?: string
  /**
   * For Vite users, this option is already enabled by `vite-env.d.ts` file.
   *
   * Create `icons.d.ts` file at the root of your project. Make sure to add this file in your `tsconfig.json` file.
   *
   * ```json
   * {
   *  "include": [
   *    "icons.d.ts"
   *  ]
   * }
   * ```
   *
   * Inject `svgList` and `importSvg()` in the window object: `window.svgList` and `window.importSvg()`.
   * These methods are fully typed.
   *
   * @default false
   */
  global?: boolean
  /**
   * Directory where `icons.ts` will be created.
   *
   * @default './src'
   */
  libraryDir?: string
  /**
   * Directory where your SVG files are located.
   *
   * @default './src/svg'
   */
  svgDir?: string
  /**
   * Use types, if you want to use JavaScript instead of TypeScript, set this option to false.
   * You can't have autocompletion with JavaScript.
   *
   * @default true
   */
  useTypes?: boolean
}

export interface OptionsExtended extends PluginOptions {
  isTesting?: boolean
  isNuxt?: boolean
  nuxtDir?: string
}
