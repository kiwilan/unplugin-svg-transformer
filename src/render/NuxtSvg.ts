/* eslint-disable ts/ban-ts-comment */
import type { PropType } from 'vue'
import { defineComponent, h, onMounted, ref, watch } from 'vue'
import { defaultSvg } from './shared'

// @ts-nocheck
// @ts-expect-error - ignore
import { importSvg } from '#icons'

const NuxtSvg = defineComponent({
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

    importSvg(props.name).then((svg: string) => current.value = svg)

    if (props.reactive) {
      watch(() => props.name, () => {
        importSvg(props.name).then((svg: string) => current.value = svg)
      })
    }

    onMounted(async () => {
      importSvg(props.name).then((svg: string) => current.value = svg)
    })

    return () => h('span', { ...attributes, innerHTML: current.value })
  },
})

export default NuxtSvg
