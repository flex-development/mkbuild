/**
 * @file Plugin Options - clean
 * @module mkbuild/plugins/clean/options
 */

import type { FileSystemAdapter } from '#src/types'

/**
 * Output directory cleaning options.
 */
interface CleanPluginOptions {
  /**
   * Creates a directory.
   *
   * If the directory structure does not exist, it will be created.
   *
   * @default fsa.mkdir
   */
  mkdir?: FileSystemAdapter['mkdir']

  /**
   * Removes a directory or file.
   *
   * @default fsa.rm
   */
  rm?: FileSystemAdapter['rm']

  /**
   * Unlinks a directory or file.
   *
   * @default fsa.unlink
   */
  unlink?: FileSystemAdapter['unlink']
}

export type { CleanPluginOptions as default }
