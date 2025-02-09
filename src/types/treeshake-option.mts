/**
 * @file Type Aliases - TreeshakeOption
 * @module mkbuild/types/TreeshakeOption
 */

import type { TreeshakingOptions, TreeshakingPreset } from 'rollup'

/**
 * Union of values used to apply tree-shaking and fine-tune the tree-shaking
 * process.
 *
 * @see {@linkcode TreeshakingOptions}
 * @see {@linkcode TreeshakingPreset}
 */
type TreeshakeOption = TreeshakingOptions | TreeshakingPreset | boolean

export type { TreeshakeOption as default }
