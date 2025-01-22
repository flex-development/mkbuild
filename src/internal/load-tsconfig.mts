/**
 * @file Internal - loadTsconfig
 * @module mkbuild/internal/loadTsconfig
 */

import type { ModuleId } from '@flex-development/mlly'
import * as tscu from '@flex-development/tsconfig-utils'
import json5 from 'json5'

export default loadTsconfig

/**
 * Tsconfig loading options.
 *
 * @see {@linkcode tscu.LoadTsconfigOptions}
 *
 * @internal
 *
 * @extends {tscu.LoadTsconfigOptions}
 */
interface Options extends tscu.LoadTsconfigOptions {
  /**
   * Module id of tsconfig file.
   *
   * @see {@linkcode ModuleId}
   */
  tsconfig?: ModuleId | null | undefined

  /**
   * Raw tsconfig.
   *
   * @see {@linkcode tscu.Tsconfig}
   */
  tsconfigRaw?: tscu.Tsconfig | string | null | undefined
}

/**
 * Load a tsconfig.
 *
 * @see {@linkcode Options}
 * @see {@linkcode tscu.Tsconfig}
 *
 * @internal
 *
 * @async
 *
 * @param {Options} options
 *  Load options
 * @return {Promise<tscu.Tsconfig>}
 *  TypeScript configuration options
 */
async function loadTsconfig(options: Options): Promise<tscu.Tsconfig> {
  /**
   * Parsed tsconfig.
   *
   * @var {tscu.Tsconfig} tsconfig
   */
  let tsconfig: tscu.Tsconfig = {}

  if (typeof options.tsconfigRaw === 'object' && options.tsconfigRaw) {
    tsconfig = { ...options.tsconfigRaw }
  } else if (typeof options.tsconfigRaw === 'string' && options.tsconfigRaw) {
    tsconfig = json5.parse<tscu.Tsconfig>(options.tsconfigRaw)
  } else if (options.tsconfig) {
    tsconfig = (await tscu.loadTsconfig(options.tsconfig, options))!.tsconfig
  }

  return tsconfig.compilerOptions ??= {}, tsconfig
}
