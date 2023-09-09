/**
 * @file Type Definitions - RepoProviderMap
 * @module grease/types/RepoProviderMap
 */

import type { Pick, Simplify } from '@flex-development/tutils'
import type { RepoProvider } from '../enums'
import type { Context } from '../interfaces'

/**
 * Repository provider configuration map.
 *
 * @see {@linkcode Context}
 * @see {@linkcode RepoProvider}
 */
type RepoProviderMap = Simplify<
  Record<RepoProvider, Pick<Context, 'host' | 'keywords'>>
>

export type { RepoProviderMap as default }
