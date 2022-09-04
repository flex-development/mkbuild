/**
 * @file Interfaces - BuildOptions
 * @module mkbuild/interfaces/BuildOptions
 */

import type { OneOrMany } from '@flex-development/tutils'
import type { TransformOptions } from 'esbuild'
import type { Options as GlobbyOptions } from 'globby'
import type BuildEntry from './build-entry'

/**
 * Build options.
 */
interface BuildOptions {
  /**
   * Remove output directory before starting build.
   *
   * @default true
   */
  clean?: boolean

  /**
   * Root project directory.
   *
   * **Note**: Expected to contain a `package.json` file.
   *
   * @default process.cwd()
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
  entries?: BuildEntry[]

  /**
   * [esbuild transform API][1] options.
   *
   * [1]: https://esbuild.github.io/api/#transform-api
   *
   * @default {}
   */
  esbuild?: Omit<TransformOptions, 'format' | 'loader' | 'sourcefile'>

  /**
   * Custom implementations of `fs` methods.
   *
   * @see https://github.com/mrmlnc/fast-glob#fs
   * @see https://github.com/jprichardson/node-fs-extra
   *
   * @default fse
   */
  fs?: GlobbyOptions['fs']

  /**
   * Output directory.
   *
   * @default 'dist'
   */
  outdir?: string

  /**
   * Glob patterns matching {@link source} files to exclude or include.
   *
   * @see https://github.com/sindresorhus/globby
   *
   * @default ['**','!**\/{__mocks__,__snapshots__,__tests__}\/**']
   */
  pattern?: OneOrMany<string>

  /**
   * Name of directory containing source files.
   *
   * @default 'src'
   */
  sourcedir?: string
}

export type { BuildOptions as default }
