import type { PropType } from 'vue'
import { defineComponent, h, onMounted, ref, watch } from 'vue'
import { type Display, defaultSvg, warningSvg } from './shared'

const VueSvg = defineComponent({
  name: 'SvgIcon',
  props: {
    name: {
      type: String as PropType<string>,
      required: true,
    },
    display: {
      type: String as PropType<Display>,
      required: false,
      default: 'inline-block',
    },
  },
  setup(props, { attrs }) {
    const defaultSSR = defaultSvg(props.name, true)
    const current = ref<string>(defaultSSR)

    const attributes = ref({
      ...(attrs as Record<string, any>),
      style: {
        ...(attrs as Record<string, any>).style,
      },
    })

    if (props.display !== false)
      attributes.value.style.display = props.display

    async function getSvg() {
      const wd = window as any
      if (!wd || !wd.importIcon) {
        current.value = warningSvg
        console.warn('[unplugin-svg-transformer] Error: window.importIcon is not defined, you should import `icons.ts` into your main file.')

        return
      }
      const svg = await wd.importIcon(props.name)
      current.value = svg.default
    }

    watch(() => props.name, async () => {
      await getSvg()
    })

    onMounted(async () => {
      await getSvg()
    })

    return () => h('span', { ...attributes, innerHTML: current.value })
  },
})

export {
  VueSvg,
}
