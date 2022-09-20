/**
 * @file Utilities - esbuilder
 * @module mkbuild/utils/esbuilder
 */

import {
  BUILTIN_MODULES,
  EXT_JS_REGEX,
  EXT_TS_REGEX,
  RESOLVE_EXTENSIONS
} from '#src/config/constants'
import type { Entry, Result, SourceFile } from '#src/interfaces'
import dts from '#src/plugins/dts/plugin'
import fullySpecified from '#src/plugins/fully-specified/plugin'
import tsconfigPaths from '#src/plugins/tsconfig-paths/plugin'
import type { OutputMetadata } from '#src/types'
import { build } from 'esbuild'
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
  if ((format === 'esm' || ext === '.cjs') && !bundle) {
    plugins.unshift(fullySpecified())
  }

  // add tsconfig-paths plugin
  if ((tsconfig || process.env.TS_NODE_PROJECT) && !bundle) {
    plugins.unshift(tsconfigPaths())
  }

  // add dts plugin
  if (declaration && !src.ext.startsWith('.d')) {
    if (EXT_JS_REGEX.test(src.ext) || EXT_TS_REGEX.test(src.ext)) {
      plugins.unshift(dts())
    }
  }

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
    outdir: `${outdir}/${pathe.dirname(src.file)}`.replace(/\/\./, ''),
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
      exports: metadata.exports,
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
