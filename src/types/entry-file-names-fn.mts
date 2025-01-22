/**
 * @file Type Aliases - EntryFileNamesFn
 * @module mkbuild/types/EntryFileNamesFn
 */

import type { PreRenderedChunk } from 'rollup'

/**
 * Get a pattern to use for naming chunks created from entry points.
 *
 * Patterns support the following placeholders:
 *
 * - `{extname}`: normalized output file extension (e.g. `.mjs`, `.cjs`),
 *   supported by `mkbuild` only
 * - `[format]`: normalized rendering format (e.g. `es`, `cjs`)
 * - `[hash]`: hash based only on the content of the final generated chunk,
 *   including transformations in [`renderChunk`][render-chunk] and any
 *   referenced file hashes. the hash length can also be specified by appending
 *   a colon and length: `[hash:13]`
 * - `[name]`: file name (without extension) of the entry point, unless the
 *   object form of input was used to define a different name
 *
 * Forward slashes `/` can be used to place files in sub-directories.
 *
 * [render-chunk]: https://rollupjs.org/plugin-development/#renderchunk
 *
 * @see {@linkcode PreRenderedChunk}
 *
 * @this {void}
 *
 * @param {PreRenderedChunk} chunk
 *  Pre-rendered entry chunk
 * @return {string}
 *  Pattern to use for naming `chunk`
 */
type EntryFileNamesFn = (this: void, chunk: PreRenderedChunk) => string

export type { EntryFileNamesFn as default }
