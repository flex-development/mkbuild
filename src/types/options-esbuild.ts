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
  | 'entryNames'
  | 'entryPoints'
  | 'incremental'
  | 'metafile'
  | 'outfile'
  | 'stdin'
  | 'watch'
  | 'write'
>

export type { EsbuildOptions as default }
