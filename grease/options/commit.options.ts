/**
 * @file Options - CommitOptions
 * @module grease/options/CommitOptions
 */

import type { CommitTransformer } from '../types'
import type RawCommitOptions from './commit-raw.options'

/**
 * Commit retrieval and parsing options.
 *
 * @see {@linkcode RawCommitOptions}
 *
 * @extends {RawCommitOptions}
 */
type CommitOptions = RawCommitOptions & {
  /**
   * Parsed commit transformer.
   *
   * @see {@linkcode CommitTransformer}
   *
   * @default identity
   */
  transform?: CommitTransformer
}

export type { CommitOptions as default }
