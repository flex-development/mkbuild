/**
 * @file Type Definitions - Sourcemap
 * @module mkbuild/types/Sourcemap
 */

import type * as esbuild from 'esbuild'

/**
 * esbuild `sourcemap` options.
 *
 * @see https://esbuild.github.io/api/#sourcemap
 */
type Sourcemap = Exclude<
  NonNullable<esbuild.BuildOptions['sourcemap']>,
  boolean
>

export type { Sourcemap as default }
