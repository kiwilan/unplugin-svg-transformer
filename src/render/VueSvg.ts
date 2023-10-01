import type { PropType } from 'vue'
import { defineComponent, h, onMounted, ref, watch } from 'vue'
import { defaultSvg, warningSvg } from './shared'
import type { Display, LibraryType } from './shared'

const VueSvg = defineComponent({
  name: 'SvgIcon',
  props: {
    name: {
      type: String as PropType<SvgName>,
      required: true,
    },
    title: {
      type: String as PropType<string>,
      required: false,
      default: undefined,
    },
    reactive: {
      type: Boolean as PropType<boolean>,
      required: false,
      default: false,
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
    }) as any

    if (props.title)
      attributes.value.title = props.title

    async function getSvg() {
      current.value = ''
      const wd = window as unknown as LibraryType
      if (!wd || !wd.ust || !wd.ust.importSvg) {
        current.value = warningSvg
        console.warn('[unplugin-svg-transformer] Error: window.importSvg is not defined, you should import `unplugin-svg-transformer/icons` into your main file.')

        return
      }

      current.value = await wd.ust.importSvg(props.name)
    }

    if (props.reactive) {
      watch(() => props.name, async () => {
        await getSvg()
      })
    }

    onMounted(async () => {
      await getSvg()
    })

    return () => h('span', { ...attributes, innerHTML: current.value })
  },
})

export {
  VueSvg,
}
