/**
 * @file Custom Loader Hooks
 * @module loader
 * @see https://nodejs.org/api/esm.html#loaders
 */

import * as mlly from '@flex-development/mlly'
import * as pathe from '@flex-development/pathe'
import * as tscu from '@flex-development/tsconfig-utils'
import * as tutils from '@flex-development/tutils'
import * as esbuild from 'esbuild'
import { fileURLToPath, pathToFileURL } from 'node:url'

// add support for extensionless files in "bin" scripts
// https://github.com/nodejs/modules/issues/488
mlly.EXTENSION_FORMAT_MAP.set('', mlly.Format.COMMONJS)

/**
 * URL of tsconfig file.
 *
 * @type {import('node:url').URL}
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
 * @return {Promise<mlly.Format>} Hook result
 */
export const getFormat = mlly.getFormat

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
export const getSource = mlly.getSource

/**
 * Determines how the module at the given `url` should be interpreted,
 * retrieved, and parsed.
 *
 * @see {@linkcode LoadHookContext}
 * @see https://nodejs.org/api/esm.html#loadurl-context-nextload
 *
 * @async
 *
 * @param {string} url - Resolved module URL
 * @param {LoadHookContext} context - Hook context
 * @return {Promise<LoadHookResult>} Hook result
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
   * Source code.
   *
   * @type {Uint8Array | string | undefined}
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
 * Resolves the given module `specifier`.
 *
 * Adds supports for:
 *
 * - Path alias resolution
 * - Extensionless file and directory index resolution
 *
 * @see {@linkcode ResolveHookContext}
 * @see https://nodejs.org/api/esm.html#resolvespecifier-context-nextresolve
 *
 * @async
 *
 * @param {string} specifier - Module specifier
 * @param {ResolveHookContext} context - Hook context
 * @return {Promise<ResolveHookResult>} Hook result
 * @throws {Error}
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
   * @type {import('node:url').URL}
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
