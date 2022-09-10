/**
 * @file Fixtures - relative-specifiers
 * @module fixtures/relative-specifiers
 */

import 'esbuild'
import 'pathe'
import 'tsconfig-paths'
import 'tsconfig-paths/lib/tsconfig-loader'
import '../src/config/constants.js'
import '../src/utils/extract-statements'

export const fizz: string = 'buzz'

export * from '../src/interfaces'
