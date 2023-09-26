import antfu from '@antfu/eslint-config'

export default antfu({
  gitignore: true,
  ignores: [
    'coverage',
    'resources',
    '**/*.md',
    'examples',
    'playground',
  ],
  rules: {
    'n/prefer-global/process': 'off',
    'node/prefer-global/process': 'off',
    'eslint-comments/no-unlimited-disable': 'off',
  },
})
