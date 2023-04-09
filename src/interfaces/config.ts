/**
 * @file Interfaces - Config
 * @module mkbuild/interfaces/Config
 */

import type { FileSystemAdapter } from '#src/types'
import type * as esbuild from 'esbuild'
import type Options from './options'
import type Task from './task'

/**
 * Build configuration options.
 *
 * @extends {Options}
 */
interface Config extends Options {
  /**
   * Load build config from config file.
   *
   * @default true
   */
  configfile?: boolean

  /**
   * Build entries.
   *
   * **Note**: If empty or `undefined`, a single build entry will be inferred
   * from the remaining set of configuration options.
   *
   * @default []
   */
  entries?: Partial<Omit<Task, 'write'>>[]

  /**
   * Custom implementations of file system methods.
   *
   * @see {@linkcode FileSystemAdapter}
   * @see https://nodejs.org/api/fs.html
   *
   * @default fsa
   */
  fs?: FileSystemAdapter

  /**
   * Serve files.
   *
   * @see {@linkcode esbuild.ServeOptions}
   * @see https://esbuild.github.io/api/#serve
   *
   * @default false
   */
  serve?: esbuild.ServeOptions | boolean

  /**
   * Watch files.
   *
   * @default false
   */
  watch?: boolean

  /**
   * Write build results.
   *
   * @default false
   */
  write?: boolean
}

export type { Config as default }
