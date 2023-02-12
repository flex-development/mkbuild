/**
 * @file Type Definitions - OutputMetadata
 * @module mkbuild/types/OutputMetadata
 */

import type * as esbuild from 'esbuild'

/**
 * Output file metadata.
 *
 * @see {@linkcode esbuild.Metafile}
 */
type OutputMetadata = esbuild.Metafile['outputs'][string]

export type { OutputMetadata as default }
