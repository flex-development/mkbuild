/**
 * @file Type Aliases - SourcemapFileNamesFn
 * @module mkbuild/types/SourcemapFileNamesFn
 */

import type { PreRenderedChunk } from 'rollup'

/**
 * Get a pattern to use for naming sourcemaps.
 *
 * Patterns support the following placeholders:
 *
 * - `[chunkhash]`: the same hash as the one used for `chunk`
 * - `[format]`: normalized rendering format (e.g. `es`, `cjs`)
 * - `[hash]`: hash based only on the content of the final generated sourcemap.
 *   the hash length can also be specified: `[hash:13]`
 * - `[name]`: file name (without extension) of the entry point, unless the
 *   object form of input was used to define a different name
 *
 * Forward slashes `/` can be used to place files in sub-directories.
 *
 * @see {@linkcode PreRenderedChunk}
 *
 * @this {void}
 *
 * @param {PreRenderedChunk} chunk
 *  Pre-rendered output chunk
 * @return {string}
 *  Sourcemap file name for `chunk`
 */
type SourcemapFileNamesFn = (this: void, chunk: PreRenderedChunk) => string

export type { SourcemapFileNamesFn as default }
