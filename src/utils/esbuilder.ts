/**
 * @file Utilities - esbuilder
 * @module mkbuild/utils/esbuilder
 */

import {
  EXT_JS_REGEX,
  EXT_TS_REGEX,
  RESOLVE_EXTENSIONS
} from '#src/config/constants'
import type { Entry, Result, SourceFile } from '#src/interfaces'
import dts from '#src/plugins/dts/plugin'
import fullySpecified from '#src/plugins/fully-specified/plugin'
import tsconfigPaths from '#src/plugins/tsconfig-paths/plugin'
import type { OutputMetadata } from '#src/types'
import { build, type BuildOptions, type Loader } from 'esbuild'
import * as pathe from 'pathe'
import loaders from './loaders'

/**
 * Builds `source` using the [esbuild build API][1].
 *
 * [1]: https://esbuild.github.io/api/#build-api
 *
 * @todo support bundling
 * @todo support code splitting
 *
 * @async
 *
 * @param {Pick<SourceFile, 'ext' | 'file'>} source - Build source
 * @param {Entry} entry - Build entry
 * @param {BuildOptions} [options={}] - [Build API][1] options
 * @return {Promise<Result[]>} Build results
 */
const esbuilder = async (
  source: Pick<SourceFile, 'ext' | 'file'>,
  entry: Entry,
  options: BuildOptions = {}
): Promise<Result[]> => {
  // remove forbidden options
  delete options.entryNames
  delete options.incremental
  delete options.outdir
  delete options.outfile
  delete options.publicPath
  delete options.stdin
  delete options.watch

  // remove unimplemented options
  delete options.assetNames
  delete options.bundle
  delete options.chunkNames
  delete options.external
  delete options.splitting

  // normalize options
  options.absWorkingDir = options.absWorkingDir ?? process.cwd()
  options.loader = options.loader ?? {}
  options.outExtension = options.outExtension ?? {}
  options.plugins = options.plugins ?? []

  // add fully-specified plugin
  if (entry.format === 'esm' || entry.ext === '.cjs') {
    options.plugins.unshift(fullySpecified())
  }

  // add tsconfig-paths plugin
  if (options.tsconfig || process.env.TS_NODE_PROJECT) {
    options.plugins.unshift(tsconfigPaths())
  }

  // add dts plugin
  if (entry.declaration && !source.ext.startsWith('.d')) {
    if (EXT_JS_REGEX.test(source.ext) || EXT_TS_REGEX.test(source.ext)) {
      options.plugins.unshift(dts())
    }
  }

  /**
   * [Loader][1] configuration for [build api][2].
   *
   * [1]: https://esbuild.github.io/api/#loader
   * [2]: https://esbuild.github.io/api/#build-api
   *
   * @const {Record<string, Loader>} loader
   */
  const loader: Record<string, Loader> = loaders(entry.format, entry.bundle)

  // build source
  const { errors, metafile, outputFiles, warnings } = await build({
    ...options,
    entryPoints: [`${entry.source}/${source.file}`],
    format: entry.format,
    loader: {
      ...(loader[source.ext] ? loader : { ...loader, [source.ext]: 'copy' }),
      ...options.loader
    },
    metafile: true,
    outExtension: { ...options.outExtension, '.js': entry.ext },
    outfile: pathe.format({
      dir: `${entry.outdir}/${pathe.dirname(source.file)}`.replace(/\/\./, ''),
      ext: entry.ext,
      name: pathe.basename(source.file, source.ext)
    }),
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
