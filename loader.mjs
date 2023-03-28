/**
 * @file Custom Loader Hooks
 * @module loader
 * @see https://nodejs.org/api/esm.html#loaders
 */

import * as esm from '@flex-development/esm-types'
import * as mlly from '@flex-development/mlly'
import * as pathe from '@flex-development/pathe'
import * as tscu from '@flex-development/tsconfig-utils'
import * as tutils from '@flex-development/tutils'
import * as esbuild from 'esbuild'
import { URL, fileURLToPath, pathToFileURL } from 'node:url'

// add support for extensionless files in "bin" scripts
// https://github.com/nodejs/modules/issues/488
mlly.EXTENSION_FORMAT_MAP.set('', mlly.Format.COMMONJS)

/**
 * {@linkcode URL} of tsconfig file.
 *
 * @type {URL}
 * @const tsconfig
 */
const tsconfig = mlly.toURL('tsconfig.json')

/**
 * TypeScript compiler options.
 *
 * @type {tscu.CompilerOptions}
 * @const compilerOptions
 */
const compilerOptions = tscu.loadCompilerOptions(tsconfig)

/**
 * Determines how the given module `url` should be interpreted.
 *
 * The `format` returned also affects what the acceptable forms of source values
 * are for a module when parsing.
 *
 * @see {@linkcode esm.GetFormatHookResult}
 * @see {@linkcode esm.GetFormatHook}
 * @see {@linkcode esm.ResolvedModuleUrl}
 * @see https://nodejs.org/docs/latest-v14.x/api/esm.html#esm_getformat_url_context_defaultgetformat
 *
 * @async
 *
 * @param {esm.ResolvedModuleUrl} url - Resolved module URL
 * @return {Promise<esm.GetFormatHookResult>} Hook result
 */
export const getFormat = async url => ({ format: await mlly.getFormat(url) })

/**
 * Retrieves the source code of an ES module specifier.
 *
 * @see {@linkcode esm.GetSourceHook}
 * @see {@linkcode esm.ResolvedModuleUrl}
 * @see {@linkcode esm.SourceHookResult}
 * @see https://nodejs.org/docs/latest-v14.x/api/esm.html#esm_getsource_url_context_defaultgetsource
 *
 * @async
 *
 * @param {esm.ResolvedModuleUrl} url - Resolved module URL
 * @return {Promise<esm.SourceHookResult>} Hook result
 */
export const getSource = async url => ({ source: await mlly.getSource(url) })

/**
 * Determines how the given module `url` should be interpreted, retrieved, and
 * parsed.
 *
 * @see {@linkcode esm.LoadHookContext}
 * @see {@linkcode esm.LoadHookResult}
 * @see {@linkcode esm.LoadHook}
 * @see {@linkcode esm.ResolvedModuleUrl}
 * @see https://nodejs.org/api/esm.html#loadurl-context-nextload
 *
 * @async
 *
 * @param {esm.ResolvedModuleUrl} url - Resolved module URL
 * @param {esm.LoadHookContext} context - Hook context
 * @return {Promise<esm.LoadHookResult>} Hook result
 */
export const load = async (url, context) => {
  // get module format
  context.format =
    pathe.extname(url) === '.cts'
      ? mlly.Format.MODULE
      : context.format ?? (await mlly.getFormat(url))

  // validate import assertions
  mlly.validateAssertions(url, context.format, context.importAssertions)

  /**
   * Module source code.
   *
   * @type {esm.Source<Uint8Array | string> | undefined}
   * @const source
   */
  const source = await mlly.getSource(url, context)

  return {
    format: context.format,
    shortCircuit: true,
    source: await transformSource(source, { ...context, url }, () => source)
  }
}

/**
 * Resolves the given module `specifier`, and its module format as a hint to the
 * {@linkcode load} hook.
 *
 * Adds supports for:
 *
 * - Path alias resolution
 * - Extensionless file and directory index resolution
 *
 * @see {@linkcode esm.ResolveHookContext}
 * @see {@linkcode esm.ResolveHookResult}
 * @see {@linkcode esm.ResolveHook}
 * @see https://nodejs.org/api/esm.html#resolvespecifier-context-nextresolve
 *
 * @async
 *
 * @param {string} specifier - Module specifier
 * @param {esm.ResolveHookContext} context - Hook context
 * @return {esm.Promise<esm.ResolveHookResult>} Hook result
 */
export const resolve = async (specifier, context) => {
  const { conditions, parentURL: parent } = context

  // resolve path alias
  specifier = await mlly.resolveAlias(specifier, {
    aliases: tscu.loadPaths(tsconfig),
    conditions,
    cwd: pathToFileURL(compilerOptions.baseUrl),
    parent
  })

  /**
   * Resolved module URL.
   *
   * @type {URL}
   * @const url
   */
  const url = await mlly.resolveModule(specifier, {
    conditions,
    parent: parent?.startsWith('file:') ? parent : specifier
  })

  return {
    format: await mlly.getFormat(url),
    shortCircuit: true,
    url: url.href
  }
}

/**
 * Modifies the source code of a module.
 *
 * @see {@linkcode esm.LoadHookContext}
 * @see {@linkcode esm.Source}
 * @see {@linkcode esm.TransformSourceHookContext}
 * @see {@linkcode esm.TransformSourceHook}
 * @see https://nodejs.org/docs/latest-v14.x/api/esm.html#esm_transformsource_source_context_defaulttransformsource
 *
 * @async
 *
 * @param {esm.Source} source - Source code
 * @param {esm.LoadHookContext & esm.TransformSourceHookContext} context - Hook
 * context
 * @param {esm.TransformSourceHook} defaultTransformSource - Default Node.js
 * hook
 * @return {Promise<esm.Source>} Hook result
 */
export const transformSource = async (
  source,
  context,
  defaultTransformSource
) => {
  const { conditions = ['node', 'import'], url } = context

  /**
   * File extension of {@linkcode url}.
   *
   * @type {pathe.Ext | tutils.EmptyString}
   * @const ext
   */
  const ext = pathe.extname(url)

  // transform typescript files
  if (/^\.(?:cts|mts|tsx?)$/.test(ext) && !/\.d\.(?:cts|mts|ts)$/.test(url)) {
    // push require condition for .cts files and update format
    if (ext === '.cts') {
      context.conditions = context.conditions ?? []
      context.conditions.unshift('require', 'node')
      context.format = mlly.Format.MODULE
    }

    // resolve path aliases
    source = await tscu.resolvePaths(source, {
      conditions,
      ext: '',
      parent: url,
      tsconfig
    })

    // resolve modules
    source = await mlly.resolveModules(source, { conditions, parent: url })

    // transpile source code
    const { code } = await esbuild.transform(source, {
      format: 'esm',
      loader: ext.slice(/^\.[cm]/.test(ext) ? 2 : 1),
      minify: false,
      sourcefile: fileURLToPath(url),
      sourcemap: 'inline',
      target: `node${process.versions.node}`,
      tsconfigRaw: { compilerOptions }
    })

    return code
  }

  return defaultTransformSource(source, context, defaultTransformSource)
}
