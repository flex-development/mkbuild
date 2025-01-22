/**
 * @file Configuration - Build
 * @module config/build
 */

import { defineBuildConfig, type Config } from '@flex-development/mkbuild'
import tsconfig from './tsconfig.build.json' assert { type: 'json' }

/**
 * Build configuration.
 *
 * @type {Config}
 */
export default defineBuildConfig({
  esbuild: {
    target: ['node18', tsconfig.compilerOptions.target]
  },
  resolve: {
    conditions: tsconfig.compilerOptions.customConditions
  },
  tasks: [
    {
      dts: 'only',
      input: [
        'src/*.mts',
        'src/interfaces/*.mts',
        'src/types/*.mts',
        'src/utils/*.mts'
      ]
    },
    {
      dts: false,
      input: [
        '!src/internal/*.d.mts',
        'src/*.mts',
        'src/internal/*.mts',
        'src/plugins/*.mts',
        'src/utils/*.mts'
      ]
    }
  ],
  tsconfig: 'tsconfig.build.json'
})
