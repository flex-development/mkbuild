/**
 * @file Type Aliases - ModuleContextOption
 * @module mkbuild/types/ModuleContextOption
 */

import type {
  GetModuleContext,
  ModuleContextMap
} from '@flex-development/mkbuild'

/**
 * Union of values used to control module context.
 *
 * @see {@linkcode GetModuleContext}
 * @see {@linkcode ModuleContextMap}
 */
type ModuleContextOption = GetModuleContext | ModuleContextMap | string

export type { ModuleContextOption as default }
