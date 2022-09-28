/**
 * @file ESLint Configuration - Root
 * @module config/eslint
 * @see https://eslint.org/docs/user-guide/configuring
 */

/**
 * @type {import('eslint').Linter.Config}
 * @const config - ESLint configuration object
 */
const config = {
  root: true,
  extends: ['./.eslintrc.base.cjs'],
  overrides: [
    ...require('./.eslintrc.base.cjs').overrides,
    {
      files: ['__fixtures__/*.jsx', '__fixtures__/*.tsx'],
      extends: ['plugin:react/recommended'],
      plugins: ['react'],
      rules: {
        'react/display-name': 2,
        'react/jsx-filename-extension': [2, { extensions: ['.jsx', '.tsx'] }],
        'react/jsx-fragments': 0,
        'react/jsx-uses-react': 0,
        'react/prop-types': 0,
        'react/react-in-jsx-scope': 0,
        'react/self-closing-comp': 1,
        'unicorn/filename-case': [
          2,
          {
            cases: { pascalCase: true },
            ignore: []
          }
        ]
      },
      settings: {
        react: {
          version: 'detect'
        }
      }
    },
    {
      files: [
        '__fixtures__/*.d.cts',
        '__fixtures__/*.d.mts',
        '__fixtures__/*.d.ts'
      ],
      rules: {
        'jsdoc/require-returns-check': 0
      }
    },
    {
      files: ['__mocks__/fs-extra.ts'],
      rules: {
        'promise/avoid-new': 0
      }
    },
    {
      files: ['src/utils/__tests__/get-compiler-options.spec.ts'],
      rules: {
        'unicorn/no-keyword-prefix': 0
      }
    }
  ]
}

module.exports = config
