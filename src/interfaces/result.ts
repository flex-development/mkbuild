/**
 * @file Interfaces - Result
 * @module mkbuild/interfaces/Result
 */

import type { BuildResult, Metafile, OutputFile } from 'esbuild'

/**
 * Build result object schema.
 *
 * @extends {Metafile}
 * @extends {OutputFile}
 */
interface Result extends Metafile, OutputFile {
  /**
   * Error messages generated by [esbuild][1].
   *
   * [1]: https://esbuild.github.io
   */
  errors: BuildResult['errors']

  /**
   * Warning messages generated by [esbuild][1].
   *
   * [1]: https://esbuild.github.io
   */
  warnings: BuildResult['warnings']
}

export type { Result as default }