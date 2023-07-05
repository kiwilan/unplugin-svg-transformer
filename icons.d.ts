export {}
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    SvgIcon: typeof import('unplugin-svg-transformer/components/SvgIcon')['default']
  }
}