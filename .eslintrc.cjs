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
      files: ['__mocks__/fs-extra.ts'],
      rules: {
        'promise/avoid-new': 0
      }
    },
    {
      files: ['src/index.ts'],
      rules: {
        'unicorn/prefer-export-from': 0
      }
    }
  ]
}

module.exports = config
