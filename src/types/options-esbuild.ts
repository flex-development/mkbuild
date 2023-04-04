/**
 * @file Type Definitions - EsbuildOptions
 * @module mkbuild/types/EsbuildOptions
 */

import type * as esbuild from 'esbuild'

/**
 * Supported [esbuild build api][1] options.
 *
 * [1]: https://esbuild.github.io/api/#build-api
 */
type EsbuildOptions = Omit<
  esbuild.BuildOptions,
  | 'absWorkingDir'
  | 'conditions'
  | 'entryNames'
  | 'entryPoints'
  | 'incremental'
  | 'mainFields'
  | 'metafile'
  | 'outfile'
  | 'resolveExtensions'
  | 'stdin'
  | 'watch'
>

export type { EsbuildOptions as default }
