/**
 * @file Type Aliases - BannerFn
 * @module mkbuild/types/BannerFn
 */

import type { PreRenderedChunk } from 'rollup'

/**
 * Get a string to prepend to the contents of `chunk`.
 *
 * @see {@linkcode PreRenderedChunk}
 *
 * @this {void}
 *
 * @param {PreRenderedChunk} chunk
 *  Pre-rendered output chunk
 * @return {Promise<string> | string}
 *  String to prepend to `chunk.code`
 */
type BannerFn = (
  this: void,
  chunk: PreRenderedChunk
) => Promise<string> | string

export type { BannerFn as default }
