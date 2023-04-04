/**
 * @file Type Definitions - Jsx
 * @module mkbuild/types/Jsx
 */

import type * as esbuild from 'esbuild'

/**
 * esbuild `jsx` options.
 *
 * @see https://esbuild.github.io/api/#jsx
 */
type Jsx = NonNullable<esbuild.BuildOptions['jsx']>

export type { Jsx as default }
