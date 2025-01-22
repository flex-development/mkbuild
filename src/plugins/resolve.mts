/**
 * @file Plugins - resolve
 * @module mkbuild/plugins/resolve
 */

import VIRTUAL_MODULE_RE from '#internal/virtual-module-re'
import type WithUndefined from '#types/with-undefined'
import { isBuiltin } from '@flex-development/is-builtin'
import type {
  ResolveIdOptions,
  ResolveOptions
} from '@flex-development/mkbuild'
import {
  isRelativeSpecifier,
  resolveAlias,
  resolveModule,
  toRelativeSpecifier,
  type ResolveModuleOptions
} from '@flex-development/mlly'
import pathe from '@flex-development/pathe'
import { ok } from 'devlop'
import type {
  NormalizedInputOptions,
  PartialResolvedId,
  Plugin,
  PluginContext
} from 'rollup'

/**
 * Plugin name.
 *
 * @internal
 *
 * @const {string} PLUGIN_NAME
 */
const PLUGIN_NAME: string = 'mkbuild:resolve'

plugin.PLUGIN_NAME = PLUGIN_NAME
export default plugin

/**
 * Plugin API.
 *
 * @see {@linkcode ResolveModuleOptions}
 *
 * @internal
 *
 * @extends {ResolveModuleOptions}
 */
interface Api extends ResolveModuleOptions {
  /**
   * URL of root directory.
   *
   * @override
   */
  cwd: URL
}

/**
 * Create a module resolver plugin.
 *
 * @todo `makeAbsoluteExternalsRelative` support (?)
 *
 * @internal
 *
 * @see {@linkcode Api}
 * @see {@linkcode Plugin}
 * @see {@linkcode ResolveOptions}
 *
 * @this {void}
 *
 * @param {ResolveOptions | null | undefined} [options]
 *  Module resolve options
 * @return {Plugin<Api>}
 *  Module resolver plugin
 */
function plugin(
  this: void,
  options?: ResolveOptions | null | undefined
): Plugin<Api> {
  /**
   * Plugin api.
   *
   * @const {Api} api
   */
  const api: Api = { ...options } as Api

  return {
    api,
    buildStart,
    name: PLUGIN_NAME,
    resolveId
  }

  /**
   * Initialize the plugin api.
   *
   * @this {PluginContext}
   *
   * @param {NormalizedInputOptions} options
   *  Normalized input options
   * @return {undefined}
   */
  function buildStart(
    this: PluginContext,
    options: NormalizedInputOptions
  ): undefined {
    ok(typeof options.root === 'string', 'expected `root`')

    api.cwd = pathe.pathToFileURL(options.root)

    api.extensions ??= [
      '.mjs',
      '.js',
      '.mts',
      '.ts',
      '.jsx',
      '.tsx',
      '.json'
    ]

    api.fs = options.fs

    return void this
  }

  /**
   * Resolve `id`.
   *
   * > 👉 **Note**: Does nothing if `id` follows virtual module naming
   * > conventions.
   *
   * @see https://rollupjs.org/plugin-development/#resolveid
   *
   * @async
   *
   * @this {PluginContext}
   *
   * @param {string} id
   *  The module specifier to resolve
   * @param {string | undefined} importer
   *  The parent module path
   * @param {ResolveIdOptions} options
   *  Hook options
   * @return {Promise<PartialResolvedId | undefined>}
   *  Resolve result
   * @throws {unknown}
   */
  async function resolveId(
    this: PluginContext,
    id: string,
    importer: string | undefined,
    options: ResolveIdOptions
  ): Promise<PartialResolvedId | undefined> {
    /**
     * Resolve result.
     *
     * @var {WithUndefined<PartialResolvedId> | undefined} resolved
     */
    let resolved: WithUndefined<PartialResolvedId> | undefined

    if (!VIRTUAL_MODULE_RE.test(id)) {
      ok(api.cwd, 'expected `api.cwd`')

      /**
       * URL of parent module.
       *
       * @const {URL} parent
       */
      const parent: URL = importer ? pathe.pathToFileURL(importer) : api.cwd

      if (isBuiltin(id)) {
        resolved = {
          external: true,
          id: String(await resolveModule(id, parent))
        }
      } else {
        /**
         * Specifier of aliased module.
         *
         * @const {string | null} url
         */
        const aliased: string | null = resolveAlias(id, {
          ...api,
          absolute: false,
          parent
        })

        // reset `id` if path alias match was found
        id = aliased ?? id

        /**
         * URL of resolved module.
         *
         * @const {URL} url
         */
        const url: URL = await resolveModule(id, parent, api)

        resolved = {
          external: !options.isEntry,
          id: isRelativeSpecifier(id) ? toRelativeSpecifier(url, parent) : id
        }
      }
    }

    return resolved as PartialResolvedId
  }
}
