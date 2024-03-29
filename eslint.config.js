import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: [
    'coverage',
    'examples',
    'playground',
  ],
}, {
  rules: {
    'n/prefer-global/process': 'off',
    'node/prefer-global/process': 'off',
    'eslint-comments/no-unlimited-disable': 'off',
  },
})
