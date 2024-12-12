import pluginJs from '@eslint/js'
import pluginPrettier from 'eslint-plugin-prettier/recommended'
import globals from 'globals'
import pluginTs from 'typescript-eslint'

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...pluginTs.configs.recommended,
  pluginPrettier,
  {
    rules: {
      '@typescript-eslint/no-namespace': 'off',
      'prettier/prettier': ['error', { printWidth: 160 }],
      'max-len': [0, 160, 2, { ignoreUrls: true }],
      'no-restricted-imports': [
        'error',
        {
          patterns: ['.*'],
        },
      ],
    },
  },
]
