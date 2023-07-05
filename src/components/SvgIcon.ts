// import { h } from 'vue'

// export interface Props {
//   name?: string[]
// }

// export default {
//   props: ['name'] as (keyof Props)[],
//   setup(props: Props) {
//     return () => h('div', props.name ? props.name?.join(', ') : 'no name')
//   },
// }

import { h } from 'vue'

export default h(
  'div',
  { id: 'foo', class: 'bar' },
  [
    /* children */
  ],
)
