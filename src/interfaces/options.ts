/**
 * @file Interfaces - Options
 * @module mkbuild/interfaces/Options
 */

import type { EsbuildOptions, OutputExtension } from '#src/types'
import type { OneOrMany } from '@flex-development/tutils'
import type * as esbuild from 'esbuild'

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
   * Remove output directory before starting build.
   */
  clean?: boolean

  /**
   * Export conditions to apply.
   *
   * @see https://esbuild.github.io/api/#conditions
   *
   * @default mlly.CONDITIONS
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
   * @default !!mlly.resolveModule(cwd + 'node_modules/typescript/package.json')
   */
  dts?: boolean | 'only'

  /**
   * Output file extension.
   *
   * @default format === 'cjs' ? '.cjs' : format === 'esm' ? '.mjs' : '.js'
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
   * If a `.gitignore` file is found, patterns from the ignore file (that are
   * not negated) will be added to the default set of ignore patterns.
   *
   * @see https://github.com/mrmlnc/fast-glob#ignore
   *
   * @default IGNORE_PATTERNS
   */
  ignore?: Set<string> | string[]

  /**
   * Bundle output file name.
   *
   * @default '[name]'
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
   * Not applicable if {@linkcode bundle} is enabled.
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
   * Directory containing source files or relative path to bundle input.
   *
   * @default bundle ? 'src/index' : 'src'
   */
  source?: string
}

export type { Options as default }
