/**
 * @file Interfaces - Options
 * @module mkbuild/interfaces/Options
 */

import type { EsbuildOptions, OutputExtension } from '#src/types'
import type { OneOrMany } from '@flex-development/tutils'
import type esbuild from 'esbuild'

/**
 * Common build options.
 *
 * @extends {EsbuildOptions}
 */
interface Options extends EsbuildOptions {
  /**
   * Bundle files.
   *
   * @see https://esbuild.github.io/api/#bundle
   *
   * @default false
   */
  bundle?: boolean

  /**
   * Export conditions to apply.
   *
   * @see https://esbuild.github.io/api/#conditions
   *
   * @default bundle ? [] : mlly.CONDITIONS
   */
  conditions?: Set<string> | string[]

  /**
   * Insert `require` function definition snippet into ESM bundles.
   *
   * [1]: https://esbuild.github.io/api/#platform
   *
   * @default bundle && format === 'esm' && platform === 'node'
   */
  createRequire?: boolean

  /**
   * Current working directory.
   *
   * @default '.'
   */
  cwd?: string

  /**
   * Generate TypeScript declaration (`*.d.cts`, `*.d.mts`, or `*.d.ts`) files.
   *
   * Pass `'only'` to only write declaration files.
   *
   * @default !!mlly.resolveModule('node_modules/typescript')
   */
  dts?: boolean | 'only'

  /**
   * Output file extension.
   *
   * @default '.mjs'
   */
  ext?: OutputExtension

  /**
   * Output file format.
   *
   * @see https://esbuild.github.io/api/#format
   *
   * @default 'esm'
   */
  format?: esbuild.Format

  /**
   * An array of glob patterns to exclude matches in {@linkcode pattern}.
   *
   * **Note**: This is an alternative way to use negative patterns. Patterns
   * will be merged with those specified in {@linkcode pattern}.
   *
   * @see https://github.com/mrmlnc/fast-glob#ignore
   *
   * @default IGNORE_PATTERNS
   */
  ignore?: Set<string> | string[]

  /**
   * Bundle output file name.
   */
  name?: string

  /**
   * Output directory.
   *
   * @default 'dist'
   */
  outdir?: string

  /**
   * Glob patterns matching source files.
   *
   * @see https://github.com/sindresorhus/globby
   *
   * @default '**'
   */
  pattern?: OneOrMany<string>

  /**
   * Resolvable file extensions.
   *
   * @see https://esbuild.github.io/api/#resolve-extensions
   *
   * @default mlly.RESOLVE_EXTENSIONS
   */
  resolveExtensions?: Set<string> | string[]

  /**
   * Name of directory containing source files or relative path to bundle input.
   *
   * @default 'src'
   */
  source?: string
}

export type { Options as default }
