/**
 * @file Interfaces - Entry
 * @module mkbuild/interfaces/Entry
 */

import type { EsbuildOptions, OutputExtension } from '#src/types'
import type { Format } from 'esbuild'
import type Options from './options'

/**
 * Build entry object schema.
 *
 * @extends {EsbuildOptions}
 * @extends {Options}
 */
interface Entry extends EsbuildOptions, Options {
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
   * Output directory name.
   */
  outdir: string

  /**
   * Name of directory containing source files or relative path to bundle input.
   */
  source: string
}

export type { Entry as default }
