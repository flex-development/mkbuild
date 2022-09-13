/**
 * @file Config - esLoader
 * @module mkbuild/config/esLoader
 */

import type { Config } from '#src/interfaces'
import tsconfigPaths from '#src/plugins/tsconfig-paths/plugin'
import { build } from 'esbuild'
import { evalModule, resolveImports } from 'mlly'
import { MODULE_EXTENSIONS } from './constants'

/**
 * Loads a `*.mjs` or TypeScript (`*.cts`, `*.mts`, `*.ts`) build config file.
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
    loader: { '.cts': 'ts', '.mjs': 'js', '.mts': 'ts', '.ts': 'ts' },
    metafile: true,
    outdir: '<stdout>',
    plugins: [tsconfigPaths()],
    write: false
  })

  // resolve imports in content to evaluate module
  content = await resolveImports(output!.text, {
    extensions: MODULE_EXTENSIONS,
    url: path
  })

  // get default export from content
  const { default: config }: { default: Config } = await evalModule(content, {
    conditions: ['import'],
    extensions: MODULE_EXTENSIONS,
    url: path
  })

  return config
}

export default esLoader
