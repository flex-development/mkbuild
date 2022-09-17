/**
 * @file Interfaces - Config
 * @module mkbuild/interfaces/Config
 */

import type { BuildOptions } from 'esbuild'
import type fse from 'fs-extra'
import type { Options as GlobbyOptions } from 'globby'
import type Entry from './entry'

/**
 * Build configuration options.
 */
interface Config {
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
  esbuild?: Omit<
    BuildOptions,
    | 'absWorkingDir'
    | 'bundle'
    | 'entryNames'
    | 'entryPoints'
    | 'format'
    | 'incremental'
    | 'loader'
    | 'metafile'
    | 'outdir'
    | 'outfile'
    | 'publicPath'
    | 'stdin'
    | 'watch'
    | 'write'
  >

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
}

export type { Config as default }
