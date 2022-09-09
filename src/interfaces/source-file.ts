/**
 * @file Interfaces - SourceFile
 * @module mkbuild/interfaces/SourceFile
 */

/**
 * Source file object schema.
 */
interface SourceFile {
  /**
   * File content getter.
   *
   * @return {Promise<string>} Source file content
   */
  contents(): Promise<string>

  /**
   * Source file extension.
   */
  ext: string

  /**
   * Absolute path to source file.
   */
  file: string

  /**
   * Relative path to source file.
   *
   * **Note**: Relative to `options.sourcedir`.
   */
  path: string
}

export type { SourceFile as default }
