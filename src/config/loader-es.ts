/**
 * @file Config - esLoader
 * @module mkbuild/config/esLoader
 */

import type { Config } from '#src/interfaces'
import tsconfigPaths from '#src/plugins/tsconfig-paths/plugin'
import { build } from 'esbuild'
import { resolveImports, toDataURL } from 'mlly'
import { RESOLVE_EXTENSIONS } from './constants'

/**
 * Loads an [ESM][1] (`*.js`, `*.mjs`) or TypeScript (`*.cts`, `*.mts`, `*.ts`)
 * build config file.
 *
 * [1]: https://nodejs.org/api/esm.html
 *
 * @see https://github.com/davidtheclark/cosmiconfig#loaders
 *
 * @async
 *
 * @param {string} path - Config file path
 * @param {string} content - Config file content
 * @return {Promise<Config>} Build configuration options
 */
const esLoader = async (path: string, content: string): Promise<Config> => {
  const {
    outputFiles: [output]
  } = await build({
    entryPoints: [path],
    format: 'esm',
    loader: {
      '.cts': 'ts',
      '.js': 'js',
      '.mjs': 'js',
      '.mts': 'ts',
      '.ts': 'ts'
    },
    metafile: true,
    outdir: '<stdout>',
    plugins: [tsconfigPaths()],
    write: false
  })

  // resolve imports in content to evaluate module
  content = await resolveImports(output!.text, {
    extensions: RESOLVE_EXTENSIONS,
    url: path
  })

  return ((await import(toDataURL(content))) as { default: Config }).default
}

export default esLoader
