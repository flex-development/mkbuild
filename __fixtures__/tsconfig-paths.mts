/**
 * @file Fixtures - tsconfig-paths
 * @module fixtures/tsconfig-paths.mts
 */

import '#src/config/constants'
import '#src/utils/extract-statements'
import 'emoji-regex'
import 'esbuild'
import 'pathe'
import 'tsconfig-paths'
import 'tsconfig-paths/lib/tsconfig-loader'

export const foo: string = 'foo'

export * from '#src/interfaces'
