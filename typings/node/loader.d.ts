import type { Format } from '@flex-development/mlly'
import type { Nilable, TypedArray } from '@flex-development/tutils'

declare global {
  /**
   * {@linkcode GetFormatHook} context.
   */
  declare interface GetFormatHookContext {}

  /**
   * Determines how the given `url` should be interpreted.
   *
   * @see {@linkcode GetFormatHookContext}
   * @see https://nodejs.org/docs/latest-v14.x/api/esm.html#esm_getformat_url_context_defaultgetformat
   *
   * @async
   *
   * @param {string} url - Resolved module URL
   * @param {GetFormatHookContext} context - Hook context
   * @param {GetFormatHook} defaultGetFormat - Default Node.js hook
   * @return {Promise<Format>} Hook result
   */
  declare type GetFormatHook = (
    url: string,
    context: GetFormatHookContext,
    defaultGetFormat: GetFormatHook
  ) => Promise<Format>

  /**
   * {@linkcode GetSourceHook} context.
   */
  declare interface GetSourceHookContext {
    /**
     * Module format.
     */
    format: Format
  }

  /**
   * Retrieves the source code of a module.
   *
   * @see {@linkcode GetSourceHookContext}
   * @see https://nodejs.org/docs/latest-v14.x/api/esm.html#esm_getsource_url_context_defaultgetsource
   *
   * @async
   *
   * @param {string} url - Resolved module URL
   * @param {GetSourceHookContext} context - Hook context
   * @param {GetSourceHook} defaultGetSource - Default Node.js hook
   * @return {Promise<SharedArrayBuffer | Uint8Array | string>} Hook result
   */
  declare type GetSourceHook = (
    url: string,
    context: GetSourceHookContext,
    defaultGetSource: GetSourceHook
  ) => Promise<SharedArrayBuffer | Uint8Array | string>

  /**
   * {@linkcode LoadHook} context.
   */
  declare interface LoadHookContext {
    /**
     * Export conditions of relevant `package.json`.
     */
    conditions?: string[]

    /**
     * Module format.
     */
    format?: ResolveHookResult['format']

    /**
     * Import assertions map.
     */
    importAssertions: ImportAssertions
  }

  /**
   * {@linkcode LoadHook} result.
   */
  declare interface LoadHookResult {
    /**
     * Module format.
     */
    format: Format | Lowercase<keyof typeof Format>

    /**
     * Signal that the current {@linkcode ResolveHook} intends to terminate the
     * chain of resolve `hooks`.
     *
     * @default false
     */
    shortCircuit?: boolean | undefined

    /**
     * Source code for Node.js to evaluate.
     */
    source?: ArrayBuffer | TypedArray | string | undefined
  }

  /**
   * Determines how `url` should be interpreted, retrieved, and parsed.
   *
   * @see {@linkcode LoadHookContext}
   * @see https://nodejs.org/api/esm.html#loadurl-context-nextload
   *
   * @async
   *
   * @param {string} url - Resolved module URL
   * @param {LoadHookContext} context - Hook context
   * @param {LoadHook} nextLoad - Subsequent `load` hook in the chain or default
   * Node.js `load` hook after last user-supplied `load` hook
   * @return {Promise<LoadHookResult>} Hook result
   */
  declare type LoadHook = (
    url: string,
    context: LoadHookContext,
    defaultLoad: LoadHook
  ) => Promise<LoadHookResult>

  /**
   * {@linkcode ResolveHook} context.
   */
  declare interface ResolveHookContext {
    /**
     * Export conditions of relevant `package.json`.
     */
    conditions: string[]

    /**
     * Import assertions map.
     */
    importAssertions: ImportAssertions

    /**
     * URL of module importing the specifier to be resolved, or `undefined` if
     * the module specifier is the Node.js entry point.
     */
    parentURL?: string | undefined
  }

  /**
   * {@linkcode ResolveHook} result.
   */
  declare interface ResolveHookResult {
    /**
     * Module format hint for {@linkcode LoadHook}.
     *
     * **Note**: Hint may be ignored.
     */
    format?: Nilable<Format | Lowercase<keyof typeof Format>>

    /**
     * Signal that the current {@linkcode ResolveHook} intends to terminate the
     * chain of resolve `hooks`.
     *
     * @default false
     */
    shortCircuit?: boolean | undefined

    /**
     * Absolute URL to which module specifier resolved to.
     */
    url: string
  }

  /**
   * Resolves a file URL for a given module specifier and parent URL, and
   * optionally its format (such as `'module'`) as a hint to the `load` hook.
   *
   * @see {@linkcode ResolveHookContext}
   * @see https://nodejs.org/api/esm.html#resolvespecifier-context-nextresolve
   *
   * @async
   *
   * @param {string} specifier - Module specifier
   * @param {ResolveHookContext} context - Hook context
   * @param {ResolveHook} nextResolve - Subsequent `resolve` hook in the chain
   * or default Node.js `resolve` hook after last user-supplied `resolve` hook
   * @return {Promise<ResolveHookResult>} Hook result
   */
  declare type ResolveHook = (
    specifier: string,
    context: ResolveHookContext,
    nextResolve: ResolveHook
  ) => Promise<ResolveHookResult>

  /**
   * {@linkcode TransformSourceHook} context.
   */
  declare interface TransformSourceHookContext {
    /**
     * Export conditions.
     */
    conditions?: string[]

    /**
     * Module format.
     */
    format: Format

    /**
     * Resolved module URL.
     */
    url: string
  }

  /**
   * Modifies the source code of a module.
   *
   * @see {@linkcode TransformSourceHookContext}
   * @see https://nodejs.org/docs/latest-v14.x/api/esm.html#esm_transformsource_source_context_defaulttransformsource
   *
   * @async
   *
   * @param {SharedArrayBuffer | Uint8Array | string} source - Source code
   * @param {TransformSourceHookContext} context - Hook context
   * @param {TransformSourceHook} defaultTransformSource - Default Node.js hook
   * @return {Promise<SharedArrayBuffer | Uint8Array | string>} Hook result
   */
  declare type TransformSourceHook = (
    source: string,
    context: TransformSourceHookContext,
    defaultTransformSource: TransformSourceHook
  ) => Promise<SharedArrayBuffer | Uint8Array | string>
}
