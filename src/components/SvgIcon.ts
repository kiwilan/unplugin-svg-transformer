import { h } from 'vue'

interface Props {
  name?: string[]
}

export default {
  props: ['name'] as (keyof Props)[],
  setup(props: Props) {
    return () => h('div', props.name ? props.name?.join(', ') : 'no name')
  },
}
