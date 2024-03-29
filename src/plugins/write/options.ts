/**
 * @file Plugin Options - write
 * @module mkbuild/plugins/write/options
 */

import type { FileSystemAdapter } from '#src/types'
import type { Optional } from '@flex-development/tutils'

/**
 * Output file writing options.
 */
interface WritePluginOptions {
  /**
   * Regex pattern matching the `path` of an output file that should be written.
   *
   * @default /.+/
   */
  filter?: Optional<RegExp>

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
