/**
 * @file Fixtures - relative-specifiers
 * @module fixtures/relative-specifiers.mts
 */

import 'esbuild'
import 'node:util'
import 'pathe'
import 'tsconfig-paths'
import 'tsconfig-paths/lib/tsconfig-loader'
import '../src/config/constants.js'
import '../src/utils/extract-statements'
import '/tmp'

await import('globby')

export const fizz: string = 'buzz'

export * from '../src/interfaces'
