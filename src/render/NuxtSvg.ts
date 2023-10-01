/* eslint-disable ts/ban-ts-comment */
import type { PropType } from 'vue'
import { defineComponent, h, onMounted, ref, watch } from 'vue'
import { defaultSvg, ssr } from './shared'

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
    const html = ref(ssr(props.name))

    const attributes = ref({
      ...(attrs as Record<string, any>),
      style: {
        ...(attrs as Record<string, any>).style,
      },
    }) as any

    if (props.title)
      attributes.value.title = props.title

    async function getSvg() {
      html.value = ''
      current.value = ''
      current.value = await importSvg(props.name)
    }

    if (props.reactive) {
      watch(() => props.name, async () => {
        await getSvg()
      })
    }

    onMounted(async () => {
      await getSvg()
      html.value = current.value
    })

    return () => h('span', { ...attributes, innerHTML: html.value })
  },
})

export default NuxtSvg
