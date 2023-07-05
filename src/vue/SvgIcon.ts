import type { PropType } from 'vue'
import { defineComponent, h, onMounted, ref, watch } from 'vue'

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
      const list = window.iconList

      let svg = await list[props.name]
      if (!svg)
        svg = await list.default

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
