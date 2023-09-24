import type { PropType } from 'vue'
import { defineComponent, h, onMounted, ref, watch } from 'vue'
import { defaultSvg, ssr } from './shared'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// @ts-expect-error - ignore
import { importIcon } from '#icons'

const NuxtSvg = defineComponent({
  name: 'SvgIcon',
  props: {
    name: {
      type: String as PropType<IconType>,
      required: true,
    },
    display: {
      type: String as PropType<'block' | 'inline-block' | 'inline' | 'flex' | 'inline-flex' | 'none' | 'grid' | 'inline-grid' | 'contents' | 'flow' | 'flow-root' | 'table' | 'table-row' | 'table-cell' | false>,
      required: false,
      default: 'inline-block',
    },
  },
  setup(props, { attrs }) {
    const defaultSSR = defaultSvg(props.name, true)
    const current = ref<string>(defaultSSR)
    const html = ref(ssr(props.name))

    const attributes = ref({
      ...(attrs as Record<string, any>),
      style: {
        ...(attrs as Record<string, any>).style,
      },
    })

    if (props.display !== false)
      attributes.value.style.display = props.display

    async function getSvg() {
      const svg = await importIcon(props.name)
      current.value = svg.default
    }

    watch(() => props.name, async () => {
      await getSvg()
    })

    onMounted(async () => {
      await getSvg()
      html.value = current.value
    })

    return () => h('span', { ...attributes, innerHTML: html.value })
  },
})

export default NuxtSvg
