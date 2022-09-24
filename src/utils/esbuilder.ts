/**
 * @file Utilities - esbuilder
 * @module mkbuild/utils/esbuilder
 */

import {
  BUILTIN_MODULES,
  EXT_DTS_REGEX,
  EXT_TS_REGEX,
  IGNORE_PATTERNS,
  RESOLVE_EXTENSIONS
} from '#src/config/constants'
import type { Entry, Result, SourceFile } from '#src/interfaces'
import dts from '#src/plugins/dts/plugin'
import fullySpecified from '#src/plugins/fully-specified/plugin'
import tsconfigPaths from '#src/plugins/tsconfig-paths/plugin'
import type { OutputMetadata } from '#src/types'
import { build } from 'esbuild'
import regexp from 'escape-string-regexp'
import fse from 'fs-extra'
import { globby, type Options as GlobbyOptions } from 'globby'
import { findExportNames } from 'mlly'
import * as pathe from 'pathe'
import loaders from './loaders'

/**
 * Builds `entry` using the [esbuild build API][1].
 *
 * [1]: https://esbuild.github.io/api/#build-api
 *
 * @todo ensure `entry.source` is a directory when bundling is disabled
 * @todo ensure `entry.source` is a file (with extname) when bundling is enabled
 *
 * @async
 *
 * @param {Entry} entry - Build entry object
 * @param {GlobbyOptions['fs']} [fs=fse] - Custom  `fs` methods
 * @return {Promise<Result[]>} Build results
 */
const esbuilder = async (
  entry: Entry,
  fs: GlobbyOptions['fs'] = fse
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
    ignore = IGNORE_PATTERNS,
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
    name,
    nodePaths,
    outExtension = {},
    // eslint-disable-next-line unicorn/consistent-destructuring
    outbase = bundle ? pathe.parse(entry.source).root : entry.source,
    outdir,
    pattern = '**',
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

  /**
   * Relative paths to source files.
   *
   * **Note**: Files are relative to `source` when bundling is disbaled.
   * When enabled, files are relative to `${absWorkingDir}/`.
   *
   * @const {string[]} files
   */
  const files: string[] = bundle
    ? [source.replace(new RegExp('^' + regexp(`${absWorkingDir}/`)), '')]
    : await globby(pattern, {
        cwd: pathe.resolve(absWorkingDir, source),
        dot: true,
        fs,
        ignore
      })

  /**
   * Source file objects.
   *
   * @const {SourceFile[]} sources
   */
  const sources: SourceFile[] = files.map(file => {
    /**
     * {@link file} resolved.
     *
     * @const {string} path
     */
    const path: string = pathe.resolve(source, bundle ? '' : file)

    /**
     * {@link file} extension.
     *
     * @var {string} ext
     */
    let ext: string = pathe.extname(path)

    // ! fix extension if file is a typescript declaration file
    if (EXT_TS_REGEX.test(ext) && EXT_DTS_REGEX.test(file)) ext = '.d' + ext

    return { ext, file, path }
  })

  // add fully-specified plugin
  if (format === 'esm' || ext === '.cjs') plugins.unshift(fullySpecified())

  // add tsconfig-paths plugin
  if (tsconfig || process.env.TS_NODE_PROJECT) plugins.unshift(tsconfigPaths())

  // add dts plugin
  declaration && plugins.unshift(dts())

  // build source files
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
    entryPoints: sources.reduce<Record<string, string>>((acc, src) => {
      const { ext, file } = src

      if (bundle) {
        acc[name ?? pathe.basename(file, ext)] = file
      } else {
        acc[file.replace(new RegExp(`${regexp(ext)}$`), '')] = pathe.join(
          source,
          file
        )
      }

      return acc
    }, {}),
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
    outdir,
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
    tsconfig,
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
