/**
 * @file Interfaces - Context
 * @module grease/interfaces/Context
 */

import type { Dot } from '@flex-development/tutils'
import type { RepoProvider } from '../enums'
import type { RepoKeywords } from '../types'

/**
 * Changelog context.
 */
interface Context {
  /**
   * Repository hostname.
   *
   * @see {@linkcode RepoProvider}
   *
   * @example
   *  'github.com'
   */
  host: `${RepoProvider}${Dot}${'com' | 'org'}`

  /**
   * Keywords used in reference URLs.
   *
   * @see {@linkcode RepoKeywords}
   */
  keywords: RepoKeywords

  /**
   * Repository owner.
   *
   * @example
   *  'flex-development'
   */
  owner: string

  /**
   * Repository name on {@linkcode host}.
   *
   * @example
   *  'grease'
   */
  repo: string
}

export type { Context as default }
