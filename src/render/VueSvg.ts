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
    display: {
      type: String as PropType<Display>,
      required: false,
      default: 'inline-block',
    },
  },
  setup(props, { attrs }) {
    const defaultSSR = defaultSvg(props.name, true)
    const current = ref<string>(defaultSSR)
    const reactive = ref(false)
    const attributes = ref({
      ...(attrs as Record<string, any>),
      style: {
        ...(attrs as Record<string, any>).style,
      },
    })

    if (props.display !== false)
      attributes.value.style.display = props.display

    async function getSvg() {
      current.value = ''
      const wd = window as unknown as LibraryType
      if (!wd || !wd.ust || !wd.ust.importSvg) {
        current.value = warningSvg
        console.warn('[unplugin-svg-transformer] Error: window.importSvg is not defined, you should import `unplugin-svg-transformer/icons` into your main file.')

        return
      }

      reactive.value = wd.ust.options.reactive || false
      current.value = await wd.ust.importSvg(props.name)
    }

    if (reactive.value) {
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
