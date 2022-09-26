/**
 * @file Interfaces - Entry
 * @module mkbuild/interfaces/Entry
 */

import type { EsbuildOptions, OutputExtension } from '#src/types'
import type { Format } from 'esbuild'
import type { Options as GlobbyOptions } from 'globby'

/**
 * Build entry object schema.
 *
 * @extends {EsbuildOptions}
 */
interface Entry extends EsbuildOptions {
  /**
   * Bundle files.
   *
   * @see https://esbuild.github.io/api/#bundle
   *
   * @default false
   */
  bundle?: boolean

  /**
   * Generate TypeScript declaration (`*.d.cts`, `*.d.mts`, or `*.d.ts`) files.
   *
   * @default false
   */
  declaration?: boolean | 'only'

  /**
   * Output file extension.
   */
  ext: OutputExtension

  /**
   * Output file format.
   *
   * @see https://esbuild.github.io/api/#format
   */
  format: Format

  /**
   * An array of glob patterns to exclude matches in {@link pattern}.
   *
   * **Note**: This is an alternative way to use negative patterns. Patterns
   * will be merged with those specified in {@link pattern}.
   *
   * @see https://github.com/mrmlnc/fast-glob#ignore
   *
   * @default IGNORE_PATTERNS
   */
  ignore?: GlobbyOptions['ignore']

  /**
   * Bundle output file name.
   */
  name?: string

  /**
   * Output directory name.
   */
  outdir: string

  /**
   * Glob patterns matching source files.
   *
   * @see https://github.com/sindresorhus/globby
   *
   * @default '**'
   */
  pattern?: string[] | string

  /**
   * Name of directory containing source files or relative path to bundle input.
   */
  source: string
}

export type { Entry as default }
