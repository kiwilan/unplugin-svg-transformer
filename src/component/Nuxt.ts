import type { PropType } from 'vue'
import { defineComponent, h, onMounted, ref, watch } from 'vue'
import { defaultSvg } from './shared'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// @ts-expect-error - ignore
import { IconList } from '#icons'

const NuxtSvg = defineComponent({
  name: 'SvgIcon',
  props: {
    name: {
      type: String as PropType<string>,
      required: true,
    },
    display: {
      type: String as PropType<'block' | 'inline-block' | 'inline' | 'flex' | 'inline-flex' | 'none' | 'grid' | 'inline-grid' | 'contents' | 'flow' | 'flow-root' | 'table' | 'table-row' | 'table-cell' | false>,
      required: false,
      default: 'inline-block',
    },
  },
  setup(props, { attrs }) {
    const defaultSSR = defaultSvg(props.name)
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
      let svg = await IconList[props.name]
      if (!svg)
        svg = await IconList.default

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

export default NuxtSvg
