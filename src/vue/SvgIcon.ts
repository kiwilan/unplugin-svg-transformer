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
  setup(props, { slots, attrs }) {
    const current = ref<string>(props.name)

    async function getSvg() {
      // const path = '../icons'
      // const list = await import(path)
      console.log(process.cwd())
      // console.log(list)

      // let svg = await IconList[props.name]
      // if (!svg)
      //   svg = await IconList.default

      // current.value = svg.default
    }

    watch(() => props.name, async () => {
      await getSvg()
    })

    onMounted(async () => {
      await getSvg()
    })
    // // Split all of the brackets. Each 2n element must be highligthed
    // const highlightRegex = /\[(.*?)\]/g
    // const split = props.text.split(highlightRegex)

    // const formatted = split.map((content, index) => {
    //   const isHighlight = (index + 1) % 2 === 0
    //   // If is not highlighted text, return the raw text
    //   if (!isHighlight)
    //     return content

    //   // If user provided a #highlights slot, render the highlights
    //   // using that template and pass it the content as a slot prop
    //   if (slots.highlights)
    //     return slots.highlights({ content })

    //   // If no #highlights slot was provided, render as a default
    //   // span with the .highlight class
    //   return h('span', { class: 'highlight' }, content)
    // })

    // return () => h(props.as, { ...attrs }, formatted)

    return () => h('div', props.name ? props.name : 'name')
  },
})
