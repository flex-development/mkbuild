/**
 * @file Interfaces - Entry
 * @module grease/interfaces/Entry
 */

import type { Nullable } from '@flex-development/tutils'
import type { CommitGroup } from '../types'
import type Commit from './commit.interface'

/**
 * Object representing a changelog entry.
 */
interface Entry {
  /**
   * Changelog entry date.
   *
   * @see https://github.com/felixge/node-dateformat
   *
   * @default key.date || dateformat(tutils.timeiso(), 'yyyy-mm-dd', true)
   */
  date: string

  /**
   * Parsed commit groups.
   *
   * @see {@linkcode CommitGroup}
   */
  groups: CommitGroup[]

  /**
   * Key commit.
   *
   * @see {@linkcode Commit}
   */
  key: Commit

  /**
   * Last released version.
   */
  last_version: Nullable<string>

  /**
   * Entry is for patch release?
   *
   * @default !!semver.patch(entry.version)
   */
  patch: boolean

  /**
   * Entry is for prerelease?
   *
   * @default !!semver.prerelease(entry.version)
   */
  prerelease: boolean

  /**
   * Release version.
   */
  version: string
}

export type { Entry as default }
