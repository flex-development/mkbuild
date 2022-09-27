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
   * Insert `require` function definition when creating ESM bundles.
   *
   * When outputting ESM, any `require` calls will be replaced with esbuild's
   * `__require` shim, since [`require` is not defined in ESM environments][1].
   *
   * The shim first checks if `require` is polyfilled. If it is, the shim passes
   * the call to `require.apply`. If `require` isn't defined, an error will be
   * thrown: `Dynamic require of "' + x + '" is not supported`.
   *
   * This is particularly problematic when bundling, especially when targeting
   * node ([`platform === 'node'`][2]), since [built-in modules][3] are marked
   * as [`external`][4] by esbuild automatically. `require`ing these modules, as
   * well as other externals, will generate a runtime error. This is described
   * in [`evanw/esbuild#1921`][5].
   *
   * To circumvent this issue, [`banner.js`][6] will be updated to include a
   * snippet that defines a `require` function using [`createRequire`][7].
   *
   * [1]: https://nodejs.org/api/esm.html#no-require-exports-or-moduleexports
   * [2]: https://esbuild.github.io/api/#platform
   * [3]: https://nodejs.org/api/esm.html#builtin-modules
   * [4]: https://esbuild.github.io/api/#external
   * [5]: https://github.com/evanw/esbuild/issues/1921
   * [6]: https://esbuild.github.io/api/#banner
   * [7]: https://nodejs.org/api/module.html#modulecreaterequirefilename
   *
   * @default bundle && format === 'esm' && platform === 'node' ? true : false
   */
  createRequire?: boolean

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
