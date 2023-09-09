/**
 * @file Type Definitions - RepoKeywords
 * @module grease/types/RepoKeywords
 */

/**
 * Keywords used in reference URLs.
 */
type RepoKeywords = {
  /**
   * Commit reference keyword.
   *
   * @example
   *  'commit'
   */
  commit: string

  /**
   * Issue reference keyword.
   *
   * @example
   *  'issues'
   */
  issue: string

  /**
   * Pull request reference keyword.
   *
   * @example
   *  'pull'
   */
  pr: string
}

export type { RepoKeywords as default }
