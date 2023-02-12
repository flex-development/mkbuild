/**
 * @file Interfaces - Config
 * @module mkbuild/interfaces/Config
 */

import type { FileSystemAdapter } from '#src/types'
import type Entry from './entry'
import type Options from './options'

/**
 * Build configuration options.
 *
 * @extends {Options}
 */
interface Config extends Options {
  /**
   * Remove output directories before starting build.
   *
   * @default true
   */
  clean?: boolean

  /**
   * Build entries.
   *
   * **Note**: If empty or `undefined`, a single build entry will be inferred
   * from the remaining set of configuration options.
   *
   * @default []
   */
  entries?: Partial<Entry>[]

  /**
   * Custom implementations of file system methods.
   *
   * @see {@linkcode FileSystemAdapter}
   * @see https://nodejs.org/api/fs.html
   *
   * @default fsa
   */
  fs?: FileSystemAdapter
}

export type { Config as default }
