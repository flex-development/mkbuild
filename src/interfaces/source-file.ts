/**
 * @file Interfaces - SourceFile
 * @module mkbuild/interfaces/SourceFile
 */

/**
 * Source file object schema.
 */
interface SourceFile {
  /**
   * Source file extension.
   */
  ext: string

  /**
   * Relative path to source file.
   *
   * **Note**: Relative to `entry.source`.
   */
  file: string

  /**
   * Absolute path to source file.
   */
  path: string
}

export type { SourceFile as default }
