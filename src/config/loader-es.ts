/**
 * @file Config - esLoader
 * @module mkbuild/config/esLoader
 */

import type { Config } from '#src/interfaces'
import * as mlly from '@flex-development/mlly'
import * as pathe from '@flex-development/pathe'
import * as tscu from '@flex-development/tsconfig-utils'
import type { EmptyString } from '@flex-development/tutils'
import * as esbuild from 'esbuild'
import { pathToFileURL, type URL } from 'node:url'

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
 * @param {string} path - Absolute path to config file
 * @param {string} content - Config file content
 * @return {Promise<Config>} Build configuration options
 */
const esLoader = async (path: string, content: string): Promise<Config> => {
  /**
   * File extension of {@linkcode path}.
   *
   * @const {EmptyString | pathe.Ext} ext
   */
  const ext: EmptyString | pathe.Ext = pathe.extname(path)

  /**
   * URL of module to resolve from.
   *
   * @const {URL} parent
   */
  const parent: URL = pathToFileURL(path)

  // convert content to data url if content does not need to be transformed
  if (!/^\.(?:cts|mts|ts)$/.test(ext)) {
    content = mlly.toDataURL(await mlly.resolveModules(content, { parent }))
    return ((await import(content)) as { default: Config }).default
  }

  /**
   * Absolute path to tsconfig file.
   *
   * @const {string} tsconfig
   */
  const tsconfig: string = pathe.join(pathe.dirname(path), 'tsconfig.json')

  // resolve path aliases
  content = await tscu.resolvePaths(content, {
    baseUrl: pathe.dirname(path),
    ext: '',
    parent,
    tsconfig
  })

  // convert module specifiers to absolute specifiers
  content = await mlly.resolveModules(content, { parent })

  // convert content to pure javascript
  const { code } = await esbuild.transform(content, {
    format: 'esm',
    loader: ext.slice(/^\.[cm]/.test(ext) ? 2 : 1),
    sourcefile: path,
    tsconfigRaw: { compilerOptions: tscu.loadCompilerOptions(tsconfig) }
  } as esbuild.TransformOptions)

  return ((await import(mlly.toDataURL(code))) as { default: Config }).default
}

export default esLoader
