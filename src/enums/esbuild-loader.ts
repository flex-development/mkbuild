/**
 * @file Enums - EsbuildLoader
 * @module mkbuild/enums/EsbuildLoader
 */

import type { Loader } from 'esbuild'

/**
 * Maps supported file extensions to esbuild loaders.
 *
 * @see https://esbuild.github.io/api/#loader
 *
 * @enum {Loader}
 */
enum EsbuildLoader {
  '.cjs' = 'js',
  '.cts' = 'ts',
  '.d.cts' = 'copy',
  '.d.mts' = 'copy',
  '.d.ts' = 'copy',
  '.js' = 'js',
  '.json' = 'copy',
  '.json5' = 'copy',
  '.jsonc' = 'copy',
  '.jsx' = 'jsx',
  '.mjs' = 'js',
  '.mts' = 'ts',
  '.ts' = 'ts',
  '.tsx' = 'tsx'
}

export default EsbuildLoader
