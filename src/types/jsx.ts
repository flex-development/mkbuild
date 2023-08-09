/**
 * @file Type Definitions - Jsx
 * @module mkbuild/types/Jsx
 */

import type { Fallback } from '@flex-development/tutils'
import type * as esbuild from 'esbuild'

/**
 * esbuild `jsx` options.
 *
 * @see https://esbuild.github.io/api/#jsx
 */
type Jsx = Fallback<esbuild.BuildOptions['jsx'], never>

export type { Jsx as default }
