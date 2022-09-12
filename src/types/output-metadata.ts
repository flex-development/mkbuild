/**
 * @file Type Definitions - OutputMetadata
 * @module mkbuild/types/OutputMetadata
 */

import type { Metafile } from 'esbuild'

/**
 * Output file metadata.
 */
type OutputMetadata = Metafile['outputs'][string]

export type { OutputMetadata as default }
