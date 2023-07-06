import type { PropType } from 'vue'
import { defineComponent, h, inject, onMounted, ref, watch } from 'vue'

export default defineComponent({
  name: 'SvgIcon',
  props: {
    name: {
      type: String as PropType<string>,
      required: true,
    },
  },
  setup(props, { attrs }) {
    const current = ref<string>(props.name)

    async function getSvg() {
      const icons = inject('$icons') as Record<any, Promise<{ default: string }>>

      let svg = await icons[props.name]
      if (!svg)
        svg = await icons.default

      current.value = svg.default
    }

    watch(() => props.name, async () => {
      await getSvg()
    })

    onMounted(async () => {
      await getSvg()
    })

    return () => h('span', { ...attrs, innerHTML: current.value })
  },
})
