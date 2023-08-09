/**
 * @file Plugins - decorators
 * @module mkbuild/plugins/decorators
 */

import { DECORATOR_REGEX } from '@flex-development/decorator-regex'
import { EXT_DTS_REGEX, EXT_TS_REGEX } from '@flex-development/ext-regex'
import * as mlly from '@flex-development/mlly'
import pathe from '@flex-development/pathe'
import * as tscu from '@flex-development/tsconfig-utils'
import { DOT, cast, type Nullable } from '@flex-development/tutils'
import type {
  BuildOptions,
  OnLoadArgs,
  OnLoadOptions,
  OnLoadResult,
  Plugin,
  PluginBuild
} from 'esbuild'
import type { URL } from 'node:url'

/**
 * Plugin name.
 *
 * @const {string} PLUGIN_NAME
 */
const PLUGIN_NAME: string = 'decorators'

/**
 * Returns a plugin that allows esbuild to handle [`emitDecoratorMetadata`][1].
 *
 * [1]: https://www.typescriptlang.org/tsconfig#emitDecoratorMetadata
 *
 * @see https://github.com/evanw/esbuild/issues/257
 *
 * @param {tscu.LoadTsconfigOptions?} [options] - Plugin options
 * @return {Plugin} Decorator metadata plugin
 */
const plugin = (options?: tscu.LoadTsconfigOptions): Plugin => {
  /**
   * Allows esbuild to handle [`emitDecoratorMetadata`][1].
   *
   * [1]: https://www.typescriptlang.org/tsconfig#emitDecoratorMetadata
   * [2]: https://esbuild.github.io/plugins
   * [3]: https://esbuild.github.io/api/#build-api
   *
   * @param {PluginBuild} build - [esbuild plugin api][2]
   * @param {BuildOptions} build.initialOptions - [esbuild build api][3] options
   * @param {PluginBuild['onLoad']} build.onLoad - Function called on file load
   * @return {Promise<void>} Nothing when complete
   */
  const setup = async ({
    initialOptions,
    onLoad
  }: PluginBuild): Promise<void> => {
    const { absWorkingDir = DOT, tsconfig = 'tsconfig.json' } = initialOptions

    /**
     * User compiler options.
     *
     * @const {tscu.CompilerOptions} compilerOptions
     */
    const compilerOptions: tscu.CompilerOptions = tscu.loadCompilerOptions(
      pathe.resolve(absWorkingDir, tsconfig),
      options
    )

    // exit early if decorator metadata should not be emitted
    if (!compilerOptions.emitDecoratorMetadata) return void 0

    // inline sourcemaps
    if (compilerOptions.sourceMap) {
      compilerOptions.sourceMap = false
      compilerOptions.inlineSources = true
      compilerOptions.inlineSourceMap = true
    }

    /**
     * TypeScript module.
     *
     * @const {typeof import('typescript')} ts
     */
    const ts: typeof import('typescript') = (await import('typescript')).default

    /**
     * {@linkcode onLoad} callback options.
     *
     * @const {OnLoadOptions}
     */
    const opts: OnLoadOptions = { filter: /.*/ }

    // transpile modules containing decorators
    onLoad(opts, async (args: OnLoadArgs): Promise<Nullable<OnLoadResult>> => {
      /**
       * Callback result.
       *
       * @var {?OnLoadResult} result
       */
      let result: Nullable<OnLoadResult> = null

      // transpile modules, but skip typescript declaration modules
      if (EXT_TS_REGEX.test(args.path) && !EXT_DTS_REGEX.test(args.path)) {
        /**
         * URL of module to load.
         *
         * @const {URL} url
         */
        const url: URL = mlly.toURL(args.path)

        /**
         * File content at {@linkcode args.path}.
         *
         * @const {string} source
         */
        const source: string = cast(await mlly.getSource(url))

        // do nothing if module does contain decorators
        if (!DECORATOR_REGEX.test(source)) return null

        // transpile module to emit decorator metadata
        const { outputText: contents } = ts.transpileModule(source, {
          compilerOptions: tscu.normalizeCompilerOptions(compilerOptions),
          fileName: args.path
        })

        // set result to transpiled content, loader, and plugin name
        result = { contents, loader: 'js', pluginName: PLUGIN_NAME }
      }

      return result
    })

    return void 0
  }

  return { name: PLUGIN_NAME, setup }
}

export default plugin
