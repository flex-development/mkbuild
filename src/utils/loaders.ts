/**
 * @file Utilities - loaders
 * @module mkbuild/utils/loaders
 */

import type { Format, Loader } from 'esbuild'

/**
 * Returns the esbuild [`loader`][1] configuration.
 *
 * [1]: https://esbuild.github.io/api/#loader
 * [2]: https://esbuild.github.io/api/#build-api
 *
 * @param {Format} [format='esm'] - Output file format
 * @param {boolean} [bundle=false] - Bundling enabled?
 * @return {Record<string, Loader>} `loader` config for esbuild [build api][2]
 */
const loaders = (
  format: Format = 'esm',
  bundle: boolean = false
): Record<string, Loader> => ({
  '.cjs': format === 'cjs' && !bundle ? 'copy' : 'js',
  '.css': bundle ? 'css' : 'copy',
  '.cts': 'ts',
  '.d.cts': 'copy',
  '.d.mts': 'copy',
  '.d.ts': 'copy',
  '.data': bundle ? 'binary' : 'copy',
  '.eot': 'copy',
  '.gif': 'copy',
  '.jpeg': 'copy',
  '.jpg': 'copy',
  '.js': 'js',
  '.json': bundle ? 'json' : 'copy',
  '.json5': bundle ? 'json' : 'copy',
  '.jsonc': bundle ? 'json' : 'copy',
  '.jsx': 'jsx',
  '.mjs': format === 'esm' && !bundle ? 'copy' : 'js',
  '.mts': 'ts',
  '.otf': 'copy',
  '.png': 'copy',
  '.svg': 'copy',
  '.ts': 'ts',
  '.tsx': 'tsx',
  '.txt': bundle ? 'text' : 'copy',
  '.woff': 'copy',
  '.woff2': 'copy'
})

export default loaders
