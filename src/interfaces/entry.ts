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
   *
   * @default options.declaration
   */
  declaration?: boolean

  /**
   * Output file extension.
   *
   * @default '.mjs'
   */
  ext?: '.cjs' | '.js' | '.mjs'

  /**
   * Output file format.
   *
   * @see https://esbuild.github.io/api/#format
   *
   * @default 'esm'
   */
  format?: Format
}

export type { Entry as default }
