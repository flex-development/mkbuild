/**
 * @file Plugins - resolve
 * @module mkbuild/plugins/resolve
 */

import VIRTUAL_MODULE_RE from '#internal/virtual-module-re'
import { isBuiltin } from '@flex-development/is-builtin'
import type {
  ResolveIdOptions,
  ResolveOptions
} from '@flex-development/mkbuild'
import {
  isRelativeSpecifier,
  resolveAlias,
  resolveModule,
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

  /**
   * Bundle mode enabled?
   *
   * @var {boolean} bundle
   */
  let bundle: boolean = false

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
    ok(typeof options.bundle === 'boolean', 'expected `bundle`')
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

    bundle = options.bundle

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
   *  Path to importing (parent) module
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
     * @var {PartialResolvedId | undefined} resolved
     */
    let resolved: PartialResolvedId | undefined

    if (!VIRTUAL_MODULE_RE.test(id)) {
      ok(pathe.isURL(api.cwd), 'expected `api.cwd`')

      /**
       * URL of parent module.
       *
       * @const {URL} parent
       */
      const parent: URL = importer ? pathe.pathToFileURL(importer) : api.cwd

      if (isBuiltin(id)) {
        resolved = {
          external: true,
          id: String(await resolveModule(id, parent)),
          resolvedBy: PLUGIN_NAME
        }
      } else {
        /**
         * Specifier of aliased module.
         *
         * @const {string | null} aliased
         */
        const aliased: string | null = resolveAlias(id, {
          ...api,
          absolute: false,
          parent
        })

        resolved = { id: aliased ?? id, resolvedBy: PLUGIN_NAME }

        if (bundle || isRelativeSpecifier(resolved.id)) {
          resolved.id = pathe.fileURLToPath(await resolveModule(
            resolved.id,
            parent,
            api
          ))
        } else {
          // `resolved.id` is an absolute or bare specifier
          resolved.external = !options.isEntry
        }
      }
    }

    return resolved
  }
}
