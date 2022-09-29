/**
 * @file Interfaces - Options
 * @module mkbuild/interfaces/Options
 */

import type { EsbuildOptions, OutputExtension } from '#src/types'
import type { Format } from 'esbuild'
import type { Options as GlobbyOptions } from 'globby'

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
   * Insert `require` function definition snippet into ESM bundles.
   *
   * **Note**: Always `true` when creating ESM bundles that target [`node`][1].
   *
   * [1]: https://esbuild.github.io/api/#platform
   * [2]: ../plugins/create-require/plugin.ts
   *
   * @see [`mkbuild/plugins/create-require/plugin`][2]
   *
   * @default false
   */
  createRequire?: boolean

  /**
   * Generate TypeScript declaration (`*.d.cts`, `*.d.mts`, or `*.d.ts`) files.
   *
   * Pass `'only'` to only write declaration files.
   *
   * @default false
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
  format?: Format

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
  pattern?: string[] | string

  /**
   * Name of directory containing source files or relative path to bundle input.
   *
   * @default 'src'
   */
  source?: string
}

export type { Options as default }
