/**
 * @file Interfaces - Output
 * @module mkbuild/interfaces/Output
 */

import type { OutputMetadata } from '#src/types'
import type * as esbuild from 'esbuild'

/**
 * Object representing a build output.
 *
 * @see {@linkcode esbuild.OutputFile}
 *
 * @extends {esbuild.OutputFile}
 */
interface Output extends esbuild.OutputFile {
  /**
   * Output file size.
   *
   * @see {@linkcode OutputMetadata.bytes}
   */
  bytes: OutputMetadata['bytes']

  /**
   * Relative path to source file.
   *
   * **Note**: Relative to current working directory.
   *
   * @see {@linkcode OutputMetadata.entryPoint}
   */
  entryPoint: OutputMetadata['entryPoint']

  /**
   * Export names.
   *
   * @see {@linkcode OutputMetadata.exports}
   */
  exports: OutputMetadata['exports']

  /**
   * Import names.
   *
   * @see {@linkcode OutputMetadata.imports}
   */
  imports: OutputMetadata['imports']

  /**
   * Relative path to output file.
   *
   * **Note**: Relative to current working directory.
   *
   * @see {@linkcode OutputMetadata.outfile}
   */
  outfile: string
}

export type { Output as default }
