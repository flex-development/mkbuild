/**
 * @file Interfaces - Commit
 * @module grease/interfaces/Commit
 */

import type { Nullable } from '@flex-development/tutils'
import type { Author, BreakingChange, Reference, Trailer } from '../types'

/**
 * A parsed commit.
 *
 * @see https://conventionalcommits.org
 */
interface Commit {
  /**
   * Commit author details.
   *
   * @see {@linkcode Author}
   */
  author: Author

  /**
   * Commit body text.
   */
  body: Nullable<string>

  /**
   * Boolean indicating if commit contains breaking changes.
   */
  breaking: boolean

  /**
   * Breaking changes noted in {@linkcode subject} and {@linkcode trailers}.
   *
   * @see {@linkcode BreakingChange}
   */
  breaking_changes: BreakingChange[]

  /**
   * Commit date in strict ISO 8601 format (`%cI`).
   *
   * @see https://git-scm.com/docs/pretty-formats/2.21.0
   */
  date: string

  /**
   * Abbreviated commit SHA.
   */
  hash: string

  /**
   * Commit {@linkcode type}, {@linkcode scope}, breaking change indicator, and
   * {@linkcode subject}.
   */
  header: string

  /**
   * Users mentioned in commit message.
   */
  mentions: string[]

  /**
   * Pull request number if commit {@linkcode subject} includes a pull request
   * reference.
   */
  pr: Nullable<number>

  /**
   * Issue and/or pull request references.
   *
   * @see {@linkcode Reference}
   */
  references: Reference[]

  /**
   * Commit scope.
   */
  scope: Nullable<string>

  /**
   * Commit SHA.
   */
  sha: string

  /**
   * Commit subject.
   */
  subject: string

  /**
   * Tags associated with commit.
   */
  tags: string[]

  /**
   * Commit message trailers.
   *
   * @see {@linkcode Trailer}
   */
  trailers: Trailer[]

  /**
   * Commit type.
   */
  type: string

  /**
   * Tagged commit version.
   */
  version: Nullable<string>
}

export type { Commit as default }
