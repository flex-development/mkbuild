/**
 * @file Type Definitions - EsbuildOptions
 * @module mkbuild/types/EsbuildOptions
 */

import type { BuildOptions } from 'esbuild'

/**
 * Supported [esbuild build api][1] options.
 *
 * [1]: https://esbuild.github.io/api/#build-api
 */
type EsbuildOptions = Omit<
  BuildOptions,
  | 'bundle'
  | 'entryNames'
  | 'entryPoints'
  | 'format'
  | 'incremental'
  | 'metafile'
  | 'outbase'
  | 'outdir'
  | 'outfile'
  | 'stdin'
  | 'watch'
  | 'write'
>

export type { EsbuildOptions as default }
