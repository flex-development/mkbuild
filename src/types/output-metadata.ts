/**
 * @file Type Definitions - OutputMetadata
 * @module mkbuild/types/OutputMetadata
 */

import type esbuild from 'esbuild'

/**
 * Output file metadata.
 */
type OutputMetadata = esbuild.Metafile['outputs'][string]

export type { OutputMetadata as default }
