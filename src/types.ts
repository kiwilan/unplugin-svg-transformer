export interface Options {
  /**
   * Directory where the SVG files are located.
   *
   * @default './resources/js/Icons/svg'
   */
  iconsDir: string
  /**
   * Directory where the cache files will be created.
   *
   * @default './resources/js/Icons/cache'
   */
  cacheDir: string
  /**
   * File where the types and list of icons will be created.
   *
   * @default './resources/js/icons.ts'
   */
  filenamePath: string
  /**
   * Path to the .gitignore file.
   *
   * @default './.gitignore'
   */
  gitignorePath: string
}
