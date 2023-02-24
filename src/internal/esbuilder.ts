/**
 * @file Internal - esbuilder
 * @module mkbuild/internal/esbuilder
 */

import type { Entry, Result, SourceFile } from '#src/interfaces'
import * as mkp from '#src/plugins'
import type { FileSystemAdapter, OutputMetadata } from '#src/types'
import fsa from '#src/utils/fs'
import IGNORE_PATTERNS from '#src/utils/ignore-patterns'
import loaders from '#src/utils/loaders'
import { EXT_DTS_REGEX } from '@flex-development/ext-regex'
import * as mlly from '@flex-development/mlly'
import * as pathe from '@flex-development/pathe'
import type { PackageJson } from '@flex-development/pkg-types'
import togglePkgType from '@flex-development/toggle-pkg-type'
import * as esbuild from 'esbuild'
import regexp from 'escape-string-regexp'
import fg from 'fast-glob'
import { omit } from 'radash'

/**
 * Builds `entry` using the [esbuild build API][1].
 *
 * [1]: https://esbuild.github.io/api/#build-api
 *
 * @async
 *
 * @param {Partial<Entry>} entry - Build entry object
 * @param {PackageJson?} [pkg={}] - Relevant `package.json`
 * @param {Partial<FileSystemAdapter>?} [fs=fsa] - Custom file system methods
 * @return {Promise<[esbuild.Metafile, Result[]]>} Metafile and build results
 * @throws {esbuild.BuildFailure}
 */
const esbuilder = async (
  entry: Partial<Entry>,
  pkg: PackageJson = {},
  fs: Partial<FileSystemAdapter> = fsa
): Promise<[esbuild.Metafile, Result[]]> => {
  const {
    bundle = false,
    conditions = bundle ? [] : [...mlly.CONDITIONS],
    cwd = '.',
    dts,
    external = [],
    format = 'esm',
    ignore = [...IGNORE_PATTERNS],
    loader = {},
    name = '[name]',
    outExtension = {},
    outdir = 'dist',
    pattern = '**',
    platform = '',
    plugins = [],
    resolveExtensions = [...mlly.RESOLVE_EXTENSIONS],
    source = bundle ? 'src/index' : 'src',
    tsconfig = '',
    write = false,
    createRequire = bundle && format === 'esm' && platform === 'node',
    ext = format === 'cjs' ? '.cjs' : format === 'esm' ? '.mjs' : '.js',
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
   * Boolean indicating {@linkcode pkg.type} should be disabled before building
   * source files.
   *
   * @see https://github.com/evanw/esbuild/issues/2026
   * @see https://github.com/flex-development/toggle-pkg-type
   *
   * @const {boolean} pkgtype
   */
  const pkgtype: boolean = pkg.type === 'module' && format === 'cjs'

  /**
   * Relative paths to source files.
   *
   * **Note**: Files are relative to {@linkcode source} when {@linkcode bundle}
   * is `false`. When enabled, files are relative to {@linkcode absWorkingDir}.
   *
   * @const {string[]} files
   */
  const files: string[] = await fg(
    bundle
      ? (!pathe.extname(source) && source + '.*') || /* c8 ignore next */ source
      : pattern,
    {
      absolute: false,
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
    }
  )

  // add fully-specified plugin
  if (format === 'esm' || ['.cjs', '.mjs'].some(e => ext.endsWith(e))) {
    plugins.unshift(mkp.fullySpecified())
  }

  // add tsconfig-paths plugin
  tsconfig && !bundle && plugins.unshift(mkp.tsconfigPaths())

  // add dts plugin
  ;(dts === 'only' || dts) && !bundle && plugins.unshift(mkp.dts())

  // add create-require plugin
  createRequire && plugins.unshift(mkp.createRequire())

  // add decorators plugin
  tsconfig && plugins.unshift(mkp.decorators())

  // add output file writer plugin
  if (write) {
    plugins.push(
      mkp.write({ ...fs, filter: dts === 'only' ? EXT_DTS_REGEX : undefined })
    )
  }

  // remove unsupported options that are not overridden
  Reflect.deleteProperty(options, 'incremental')
  Reflect.deleteProperty(options, 'outfile')
  Reflect.deleteProperty(options, 'stdin')
  Reflect.deleteProperty(options, 'watch')

  // disable package type
  pkgtype && togglePkgType(null, absWorkingDir)

  // build source files
  const { errors, metafile, outputFiles, warnings } = await esbuild.build({
    ...options,
    absWorkingDir,
    bundle,
    conditions: [...new Set(conditions)],
    entryNames: `[dir]/${name}`,
    entryPoints: files
      .map((file: string): SourceFile => {
        return {
          ext: pathe.extname(file) as pathe.Ext,
          file:
            bundle && outbase !== '.'
              ? // outbase support for bundles (esbuild only uses outbase for
                // multiple entries); https://esbuild.github.io/api/#outbase
                file
                  .replace(new RegExp(`^${regexp(outbase)}`), '')
                  .replace(/^\//, '')
              : file,
          path: pathe.join(absWorkingDir, source, bundle ? '' : file)
        }
      })
      .map((sourcefile: SourceFile): string => {
        return pathe.join(bundle ? outbase : source, sourcefile.file)
      }),
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

  // reset package type
  pkgtype && togglePkgType(null, absWorkingDir)

  return [
    metafile,
    outputFiles
      .map((output: esbuild.OutputFile): Result => {
        /**
         * Relative path to output file.
         *
         * **Note**: Relative to {@linkcode absWorkingDir}.
         *
         * @const {string} outfile
         */
        const outfile: string = output.path.replace(
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
          contents: output.contents,
          entryPoint: metadata.entryPoint,
          errors,
          exports: [...new Set(metadata.exports)],
          imports: metadata.imports,
          inputs: metafile.inputs,
          outfile,
          path: output.path,
          text: output.text,
          warnings
        }
      })
      .filter(res => (dts === 'only' ? EXT_DTS_REGEX.test(res.path) : true))
  ]
}

export default esbuilder
