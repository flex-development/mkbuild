/**
 * @file Type Aliases - AssetFileNamesFn
 * @module mkbuild/types/AssetFileNamesFn
 */

import type { PreRenderedAsset } from 'rollup'

/**
 * Get a pattern to use for naming custom emitted assets.
 *
 * Patterns support the following placeholders:
 *
 * - `[ext]`: file extension of the asset, without leading dot (e.g. `css`)
 * - `[extname]`: normalized file extension of the asset (e.g. `.css`)
 * - `[format]`: normalized rendering format (e.g. `es`, `cjs`)
 * - `[hash]`: hash based on content of the asset. the hash length can also be
 *   specified by appending a colon and length: `[hash:13]`
 * - `[name]`: file name of the asset excluding any extension
 *
 * Forward slashes `/` can be used to place files in sub-directories.
 *
 * @see {@linkcode PreRenderedAsset}
 *
 * @this {void}
 *
 * @param {PreRenderedAsset} asset
 *  Pre-rendered asset
 * @return {string}
 *  Output file name for `asset`
 */
type AssetFileNamesFn = (this: void, asset: PreRenderedAsset) => string

export type { AssetFileNamesFn as default }
