/**
 * @file Interfaces - Config
 * @module mkbuild/interfaces/Config
 */

import type { EsbuildOptions, OutputExtension } from '#src/types'
import type { Format } from 'esbuild'
import type fse from 'fs-extra'
import type { Options as GlobbyOptions } from 'globby'
import type Entry from './entry'

/**
 * Build configuration options.
 */
interface Config {
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
   *
   * @default true
   */
  clean?: boolean

  /**
   * Current working directory.
   *
   * @default '.'
   */
  cwd?: string

  /**
   * Generate TypeScript declaration (`*.d.cts`, `*.d.mts`, or `*.d.ts`) files.
   *
   * @default true
   */
  declaration?: boolean

  /**
   * Build entries.
   *
   * @default []
   */
  entries?: Partial<Entry>[]

  /**
   * [esbuild build API][1] options.
   *
   * [1]: https://esbuild.github.io/api/#build-api
   *
   * @default {}
   */
  esbuild?: EsbuildOptions

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
   * Custom implementations of `fs` methods.
   *
   * @see https://github.com/mrmlnc/fast-glob#fs
   * @see https://github.com/jprichardson/node-fs-extra
   *
   * @default fse
   */
  fs?: GlobbyOptions['fs'] & {
    emptyDir: typeof fse['emptyDir']
    mkdirp: typeof fse['mkdirp']
    readJson: typeof fse['readJson']
    unlink: typeof fse['unlink']
    writeFile: typeof fse['writeFile']
  }

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

export type { Config as default }
