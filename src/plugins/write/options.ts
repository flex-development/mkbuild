/**
 * @file Plugin Options - write
 * @module mkbuild/plugins/write/options
 */

import type { FileSystemAdapter } from '#src/types'

/**
 * Output file writing options.
 */
interface WritePluginOptions {
  /**
   * Creates a directory.
   *
   * If the directory structure does not exist, it will be created.
   *
   * @default fsa.mkdir
   */
  mkdir?: FileSystemAdapter['mkdir']

  /**
   * Writes data to a file.
   *
   * @default fsa.writeFile
   */
  writeFile?: FileSystemAdapter['writeFile']
}

export type { WritePluginOptions as default }
