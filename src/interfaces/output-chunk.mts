/**
 * @file Interfaces - OutputChunk
 * @module mkbuild/interfaces/OutputChunk
 */

import type * as rollup from 'rollup'

/**
 * Build task output chunk.
 *
 * @see {@linkcode rollup.OutputChunk}
 *
 * @extends {rollup.OutputChunk}
 */
interface OutputChunk extends rollup.OutputChunk {
  /**
   * Chunk size in bytes.
   */
  bytes: number
}

export type { OutputChunk as default }
