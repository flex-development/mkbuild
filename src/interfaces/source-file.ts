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
