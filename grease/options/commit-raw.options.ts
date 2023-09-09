/**
 * @file Options - RawCommitOptions
 * @module grease/options/RawCommitOptions
 */

/**
 * Commit retrieval and parsing options.
 */
type RawCommitOptions = {
  /**
   * Path to current working directory.
   *
   * @default process.cwd()
   */
  cwd?: string

  /**
   * Enable verbose output.
   *
   * @default false
   */
  debug?: boolean

  /**
   * Revision range start.
   *
   * @default ''
   */
  from?: string

  /**
   * Revision range end.
   *
   * @default 'HEAD'
   */
  to?: string
}

export type { RawCommitOptions as default }
