/**
 * @file Interfaces - Entry
 * @module mkbuild/interfaces/Entry
 */

import type { Format } from 'esbuild'

/**
 * Build entry object schema.
 */
interface Entry {
  /**
   * Generate TypeScript declaration (`*.d.cts`, `*.d.mts`, or `*.d.ts`) files.
   */
  declaration: boolean

  /**
   * Output file extension.
   */
  ext: '.cjs' | '.js' | '.mjs'

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
   * Name of directory containing source files.
   */
  source: string
}

export type { Entry as default }
