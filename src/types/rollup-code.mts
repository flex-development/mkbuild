/**
 * @file Type Aliases - RollupCode
 * @module mkbuild/types/RollupCode
 */

import type { RollupCodeMap } from '@flex-development/mkbuild'

/**
 * Union of rollup log codes.
 *
 * To register custom log codes, augment {@linkcode RollupCodeMap}. They will
 * be added to this union automatically.
 */
type RollupCode = Extract<keyof RollupCodeMap, string>

export type { RollupCode as default }
