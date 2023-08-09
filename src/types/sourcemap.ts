/**
 * @file Type Definitions - Sourcemap
 * @module mkbuild/types/Sourcemap
 */

import type { Fallback, Optional } from '@flex-development/tutils'
import type * as esbuild from 'esbuild'

/**
 * esbuild `sourcemap` options.
 *
 * @see https://esbuild.github.io/api/#sourcemap
 */
type Sourcemap = Fallback<
  esbuild.BuildOptions['sourcemap'],
  never,
  Optional<boolean>
>

export type { Sourcemap as default }
