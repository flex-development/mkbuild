/**
 * @file Interfaces - SourceFile
 * @module mkbuild/interfaces/SourceFile
 */

import type * as pathe from '@flex-development/pathe'

/**
 * Object representing a source file.
 */
interface SourceFile {
  /**
   * File extension of source file.
   *
   * @see {@linkcode pathe.Ext}
   */
  ext: pathe.Ext

  /**
   * Relative path to source file.
   *
   * **Note**: Relative to `entry.source` if bundling is disabled; relative to
   * `entry.outbase` (defaults `pathe.parse(file).root`) otherwise.
   *
   * @see https://esbuild.github.io/api/#outbase
   */
  file: string

  /**
   * Absolute path to source file.
   */
  path: string
}

export type { SourceFile as default }
