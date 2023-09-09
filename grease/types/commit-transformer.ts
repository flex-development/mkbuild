/**
 * @file Type Definitions - CommitTransformer
 * @module grease/types/CommitTransformer
 */

import type { Commit } from '../interfaces'

/**
 * Parsed commit transformer.
 *
 * @see {@linkcode Commit}
 *
 * @template T - Transformed commit type
 *
 * @param {Commit} commit - Parsed commit
 * @param {string} raw - Raw commit
 * @return {T} Transformed commit
 */
type CommitTransformer = <T extends Commit>(
  commit: Commit,
  raw: string
) => Promise<T> | T

export type { CommitTransformer as default }
