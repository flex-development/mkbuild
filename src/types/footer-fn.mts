/**
 * @file Type Aliases - FooterFn
 * @module mkbuild/types/FooterFn
 */

import type { PreRenderedChunk } from 'rollup'

/**
 * Get a string to append to the contents of `chunk`.
 *
 * @see {@linkcode PreRenderedChunk}
 *
 * @this {void}
 *
 * @param {PreRenderedChunk} chunk
 *  Pre-rendered output chunk
 * @return {Promise<string> | string}
 *  String to append to `chunk.code`
 */
type FooterFn = (
  this: void,
  chunk: PreRenderedChunk
) => Promise<string> | string

export type { FooterFn as default }
