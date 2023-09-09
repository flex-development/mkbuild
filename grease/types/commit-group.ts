/**
 * @file Type Definitions - CommitGroup
 * @module grease/types/CommitGroup
 */

import type { Commit } from '../interfaces'

/**
 * A hidden group of commits.
 *
 * @internal
 */
type HiddenCommitGroup = {
  /**
   * Remove commit group from changelog.
   */
  hidden: true

  /**
   * Group title.
   */
  section?: string

  /**
   * Group type.
   */
  type: string
}

/**
 * A visible group of commits.
 *
 * @internal
 */
type VisibleCommitGroup = {
  /**
   * Remove commit group from changelog.
   */
  hidden?: false

  /**
   * Group title.
   */
  section: string

  /**
   * Group type.
   */
  type: string
}

/**
 * A group of commits.
 */
type CommitGroup = {
  /**
   * Grouped commits.
   *
   * @see {@linkcode Commit}
   */
  commits: Commit[]
} & (HiddenCommitGroup | VisibleCommitGroup)

export type { CommitGroup as default }
