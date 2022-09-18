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
import { build, type BuildOptions } from 'esbuild'
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
 * @param {Entry} entry - Build entry
 * @param {BuildOptions} [options={}] - [Build API][1] options
 * @return {Promise<Result[]>} Build results
 */
const esbuilder = async (
  src: Pick<SourceFile, 'ext' | 'file'>,
  entry: Entry,
  options: BuildOptions = {}
): Promise<Result[]> => {
  // remove forbidden options
  delete options.entryNames
  delete options.incremental
  delete options.outfile
  delete options.stdin
  delete options.watch

  // normalize options
  options.absWorkingDir = options.absWorkingDir ?? process.cwd()
  options.external = options.external ?? []
  options.loader = options.loader ?? {}
  options.outExtension = options.outExtension ?? {}
  options.plugins = options.plugins ?? []

  // build entry options
  const {
    bundle,
    declaration,
    ext,
    format,
    name = pathe.basename(src.file, src.ext),
    outdir,
    source
  } = entry

  // add fully-specified plugin
  if ((format === 'esm' || ext === '.cjs') && !bundle) {
    options.plugins.unshift(fullySpecified())
  }

  // add tsconfig-paths plugin
  if ((options.tsconfig || process.env.TS_NODE_PROJECT) && !bundle) {
    options.plugins.unshift(tsconfigPaths())
  }

  // add dts plugin
  if (declaration && !src.ext.startsWith('.d')) {
    if (EXT_JS_REGEX.test(src.ext) || EXT_TS_REGEX.test(src.ext)) {
      options.plugins.unshift(dts())
    }
  }

  // build source
  const { errors, metafile, outputFiles, warnings } = await build({
    ...options,
    bundle,
    entryPoints: { [name]: `${source}${bundle ? '' : `/${src.file}`}` },
    external: bundle ? [...BUILTIN_MODULES, ...options.external] : undefined,
    format,
    loader: { ...loaders(format, bundle), ...options.loader },
    metafile: true,
    outExtension: { ...options.outExtension, '.js': ext },
    outdir: `${outdir}/${pathe.dirname(src.file)}`.replace(/\/\./, ''),
    resolveExtensions: options.resolveExtensions ?? RESOLVE_EXTENSIONS,
    write: false
  })

  return outputFiles.map(({ contents, path, text }) => {
    /**
     * Relative path to output file.
     *
     * **Note**: Relative to {@link options.absWorkingDir}.
     *
     * @const {string} outfile
     */
    const outfile: string = path.replace(options.absWorkingDir! + '/', '')

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
