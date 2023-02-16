/**
 * @file Internal - esbuilder
 * @module mkbuild/internal/esbuilder
 */

import type { Entry, Result, SourceFile } from '#src/interfaces'
import * as mkp from '#src/plugins'
import type { FileSystemAdapter, OutputMetadata } from '#src/types'
import fsa from '#src/utils/fs'
import IGNORE from '#src/utils/ignore-patterns'
import loaders from '#src/utils/loaders'
import { EXT_DTS_REGEX } from '@flex-development/ext-regex'
import * as mlly from '@flex-development/mlly'
import * as pathe from '@flex-development/pathe'
import * as esbuild from 'esbuild'
import regexp from 'escape-string-regexp'
import fg from 'fast-glob'
import { omit } from 'radash'

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
 * @param {Partial<Entry>} entry - Build entry object
 * @param {Partial<FileSystemAdapter>} [fs=fsa] - Custom file system methods
 * @return {Promise<[esbuild.Metafile, Result[]]>} Metafile and build results
 * @throws {esbuild.BuildFailure}
 */
const esbuilder = async (
  entry: Partial<Entry>,
  fs: Partial<FileSystemAdapter> = fsa
): Promise<[esbuild.Metafile, Result[]]> => {
  const {
    bundle = false,
    conditions = bundle ? [] : mlly.CONDITIONS,
    createRequire: insertRequire,
    cwd = '.',
    dts: declaration,
    ext = '.mjs',
    external = [],
    format = 'esm',
    ignore = IGNORE,
    loader = {},
    name = '[name]',
    outExtension = {},
    outdir = 'dist',
    pattern = '**',
    platform = '',
    plugins = [],
    resolveExtensions = mlly.RESOLVE_EXTENSIONS,
    source = bundle ? 'src/index' : 'src',
    tsconfig = '',
    write = false,
    outbase = bundle ? pathe.parse(source).dir : source,
    ...options
  } = entry

  /**
   * Absolute path to current working directory.
   *
   * @const {string} absWorkingDir
   */
  const absWorkingDir: string =
    pathe.resolve(cwd).replace(/\/$/, '') + pathe.sep

  /**
   * Relative paths to source files.
   *
   * **Note**: Files are relative to {@linkcode source} when {@linkcode bundle}
   * is `false`. When enabled, files are relative to {@linkcode absWorkingDir}.
   *
   * @const {string[]} files
   */
  const files: string[] = await fg(bundle ? source : pattern, {
    braceExpansion: true,
    caseSensitiveMatch: true,
    cwd: pathe.join(absWorkingDir, bundle ? '' : source),
    dot: true,
    extglob: true,
    fs: omit(fs, ['readdir']),
    globstar: true,
    ignore: [...new Set(ignore)],
    objectMode: false,
    onlyFiles: true,
    stats: false,
    throwErrorOnBrokenSymbolicLink: false,
    unique: true
  })

  /**
   * Source file objects.
   *
   * @const {SourceFile[]} sources
   */
  const sources: SourceFile[] = files.map(file => {
    /**
     * Absolute path to source file.
     *
     * @const {string} path
     */
    const path: string = pathe.join(absWorkingDir, source, bundle ? '' : file)

    /**
     * File extension of source file.
     *
     * @var {string} ext
     */
    let ext: string = pathe.extname(file)

    // fix file extension if source file is typescript declaration file
    /* c8 ignore next */ EXT_DTS_REGEX.test(file) && (ext = '.d' + ext)

    return {
      ext: ext as pathe.Ext,
      file: bundle
        ? // adds outbase support for bundles (esbuild only uses outbase for
          // multiple entry points); @see https://esbuild.github.io/api/#outbase
          file.replace(new RegExp(`^${regexp(outbase)}`), '').replace(/^\//, '')
        : file,
      path
    }
  })

  // add fully-specified plugin
  if (format === 'esm' || ext === '.cjs') plugins.unshift(mkp.fullySpecified())

  // add tsconfig-paths plugin
  tsconfig && plugins.unshift(mkp.tsconfigPaths())

  // add dts plugin
  if (declaration as boolean) plugins.unshift(mkp.dts())

  // add create-require plugin
  if ((bundle && format === 'esm' && platform === 'node') || insertRequire) {
    plugins.unshift(mkp.createRequire())
  }

  // add decorators plugin
  tsconfig && plugins.unshift(mkp.decorators())

  // add output file writer plugin
  if (write) {
    plugins.push(
      mkp.write({
        ...fs,
        filter: declaration === 'only' ? EXT_DTS_REGEX : undefined
      })
    )
  }

  // remove unsupported options that are not overridden
  Reflect.deleteProperty(options, 'incremental')
  Reflect.deleteProperty(options, 'outfile')
  Reflect.deleteProperty(options, 'stdin')
  Reflect.deleteProperty(options, 'watch')

  // build source files
  const { errors, metafile, outputFiles, warnings } = await esbuild.build({
    ...options,
    absWorkingDir,
    bundle,
    conditions: [...new Set(conditions)],
    entryNames: `[dir]/${name}`,
    entryPoints: sources.reduce<Record<string, string>>((acc, src) => {
      const { ext, file } = src

      /**
       * Regex pattern matching {@linkcode ext}.
       *
       * @const {RegExp} ext_re
       */
      const ext_re: RegExp = new RegExp(`${regexp(ext)}$`)

      acc[file.replace(ext_re, '')] = pathe.join(source, bundle ? '' : file)
      return acc
    }, {}),
    external: bundle ? [...new Set(external)] : [],
    format,
    loader: { ...loaders(format, bundle), ...loader },
    metafile: true,
    outExtension: { ...outExtension, '.js': ext },
    outbase,
    outdir,
    platform: platform as esbuild.Platform,
    plugins,
    resolveExtensions: [...new Set(resolveExtensions)].map(ext => {
      return pathe.formatExt(ext)
    }),
    tsconfig,
    write: false
  })

  return [
    metafile,
    outputFiles
      .map(({ contents, path, text }) => {
        /**
         * Relative path to output file.
         *
         * **Note**: Relative to {@linkcode absWorkingDir}.
         *
         * @const {string} outfile
         */
        const outfile: string = path.replace(
          new RegExp(`^${regexp(absWorkingDir)}`),
          ''
        )

        /**
         * Output metadata.
         *
         * @const {OutputMetadata} metadata
         */
        const metadata: OutputMetadata = metafile.outputs[outfile]!

        return {
          bytes: metadata.bytes,
          contents,
          entryPoint: metadata.entryPoint,
          errors,
          exports: [...new Set(metadata.exports)],
          imports: metadata.imports,
          inputs: metafile.inputs,
          outfile,
          path,
          text,
          warnings
        }
      })
      .filter(res => {
        return declaration === 'only' ? EXT_DTS_REGEX.test(res.path) : true
      })
  ]
}

export default esbuilder
