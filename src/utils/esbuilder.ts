/**
 * @file Utilities - esbuilder
 * @module mkbuild/utils/esbuilder
 */

import { BUILTIN_MODULES, RESOLVE_EXTENSIONS } from '#src/config/constants'
import type { Entry, Result, SourceFile } from '#src/interfaces'
import dts from '#src/plugins/dts/plugin'
import fullySpecified from '#src/plugins/fully-specified/plugin'
import tsconfigPaths from '#src/plugins/tsconfig-paths/plugin'
import type { OutputMetadata } from '#src/types'
import { build } from 'esbuild'
import regexp from 'escape-string-regexp'
import { findExportNames } from 'mlly'
import * as pathe from 'pathe'
import loaders from './loaders'

/**
 * Builds `src` using the [esbuild build API][1].
 *
 * [1]: https://esbuild.github.io/api/#build-api
 *
 * @async
 *
 * @param {Pick<SourceFile, 'ext' | 'file'>} src - Source file object
 * @param {Entry} entry - Build entry object
 * @return {Promise<Result[]>} Build results
 */
const esbuilder = async (
  src: Pick<SourceFile, 'ext' | 'file'>,
  entry: Entry
): Promise<Result[]> => {
  const {
    absWorkingDir = process.cwd(),
    allowOverwrite,
    assetNames,
    banner,
    bundle,
    charset,
    chunkNames,
    color,
    conditions,
    declaration,
    define,
    drop,
    ext,
    external = [],
    footer,
    format,
    globalName,
    ignoreAnnotations,
    inject,
    jsx,
    jsxDev,
    jsxFactory,
    jsxFragment,
    jsxImportSource,
    keepNames,
    legalComments,
    loader = {},
    logLevel,
    logLimit,
    logOverride,
    mainFields,
    mangleCache,
    mangleProps,
    mangleQuoted,
    minify,
    minifyIdentifiers,
    minifySyntax,
    minifyWhitespace,
    name = pathe.basename(src.file, src.ext),
    nodePaths,
    outExtension = {},
    outbase = '',
    outdir,
    platform,
    plugins = [],
    preserveSymlinks,
    publicPath,
    pure,
    reserveProps,
    resolveExtensions = RESOLVE_EXTENSIONS,
    source,
    sourceRoot,
    sourcemap,
    sourcesContent,
    splitting,
    supported,
    target,
    treeShaking,
    tsconfig
  } = entry

  // add fully-specified plugin
  if (format === 'esm' || ext === '.cjs') plugins.unshift(fullySpecified())

  // add tsconfig-paths plugin
  if (tsconfig || process.env.TS_NODE_PROJECT) plugins.unshift(tsconfigPaths())

  // add dts plugin
  declaration && plugins.unshift(dts())

  // build source
  const { errors, metafile, outputFiles, warnings } = await build({
    absWorkingDir,
    allowOverwrite,
    assetNames,
    banner,
    bundle,
    charset,
    chunkNames,
    color,
    conditions,
    define,
    drop,
    entryPoints: { [name]: `${source}${bundle ? '' : `/${src.file}`}` },
    external: bundle ? [...new Set([...BUILTIN_MODULES, ...external])] : [],
    footer,
    format,
    globalName,
    ignoreAnnotations,
    inject,
    jsx,
    jsxDev,
    jsxFactory,
    jsxFragment,
    jsxImportSource,
    keepNames,
    legalComments,
    loader: { ...loaders(format, bundle), ...loader },
    logLevel,
    logLimit,
    logOverride,
    mainFields,
    mangleCache,
    mangleProps,
    mangleQuoted,
    metafile: true,
    minify,
    minifyIdentifiers,
    minifySyntax,
    minifyWhitespace,
    nodePaths,
    outExtension: { ...outExtension, '.js': ext },
    outbase,
    outdir: `${outdir}/${pathe.dirname(
      // support outbase (normally can only be used with multiple entries)
      // https://esbuild.github.io/api/#outbase
      // note: also removes leading slashes when outbase === ''
      src.file.replace(new RegExp('^' + regexp(`${outbase}/`)), '')
    )}`.replace(/\/\./, ''),
    platform,
    plugins,
    preserveSymlinks,
    publicPath,
    pure,
    reserveProps,
    resolveExtensions,
    sourceRoot,
    sourcemap,
    sourcesContent,
    splitting,
    supported,
    target,
    treeShaking,
    write: false
  })

  return outputFiles.map(({ contents, path, text }) => {
    /**
     * Relative path to output file.
     *
     * **Note**: Relative to {@link absWorkingDir}.
     *
     * @const {string} outfile
     */
    const outfile: string = path.replace(absWorkingDir + '/', '')

    /**
     * Output metadata.
     *
     * @const {OutputMetadata} metadata
     */
    const metadata: OutputMetadata = metafile!.outputs[outfile]!

    return {
      bytes: metadata.bytes,
      contents,
      entryPoint: metadata.entryPoint,
      errors,
      exports: [...new Set([...metadata.exports, ...findExportNames(text)])],
      imports: metadata.imports,
      inputs: metafile!.inputs,
      outfile,
      path,
      text,
      warnings
    }
  })
}

export default esbuilder
