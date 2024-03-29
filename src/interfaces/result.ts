/**
 * @file Interfaces - Result
 * @module mkbuild/interfaces/Result
 */

import type * as esbuild from 'esbuild'
import type Output from './output'
import type Task from './task'

/**
 * Object representing a build task result.
 */
interface Result {
  /**
   * Absolute path to current working directory.
   */
  cwd: string

  /**
   * Error messages generated by [esbuild][1].
   *
   * [1]: https://esbuild.github.io
   *
   * @see {@linkcode esbuild.BuildResult.errors}
   */
  errors: esbuild.BuildResult['errors']

  /**
   * Mangling configuration.
   *
   * @see https://esbuild.github.io/api/#mangle-props
   *
   * @see {@linkcode esbuild.BuildResult.mangleCache}
   */
  mangleCache: esbuild.BuildResult['mangleCache']

  /**
   * Metadata file.
   *
   * @see {@linkcode esbuild.Metafile}
   */
  metafile: esbuild.Metafile

  /**
   * Relative path to output directory.
   *
   * Path is relative to {@linkcode cwd}; does **not** include `'./'` prefix.
   *
   * @see {@linkcode Task.outdir}
   */
  outdir: Task['outdir']

  /**
   * Output files.
   *
   * @see {@linkcode Output}
   */
  outputs: Output[]

  /**
   * Warning messages generated by [esbuild][1].
   *
   * [1]: https://esbuild.github.io
   *
   * @see {@linkcode esbuild.BuildResult.warnings}
   */
  warnings: esbuild.BuildResult['warnings']
}

export type { Result as default }
