/**
 * @file Interfaces - OutputAsset
 * @module mkbuild/interfaces/OutputAsset
 */

import type * as rollup from 'rollup'

/**
 * Build task output asset.
 *
 * @see {@linkcode rollup.OutputAsset}
 *
 * @extends {rollup.OutputAsset}
 */
interface OutputAsset extends rollup.OutputAsset {
  /**
   * Asset size in bytes.
   */
  bytes: number
}

export type { OutputAsset as default }
