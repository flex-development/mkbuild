/**
 * @file Utilities - esbuilder
 * @module mkbuild/utils/esbuilder
 */

import {
  ESBUILDER_REGEX,
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

/**
 * Builds `source` using the [esbuild build API][1].
 *
 * [1]: https://esbuild.github.io/api/#build-api
 *
 * @todo support bundling
 * @todo support code splitting
 * @todo support sourcemaps
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
  // skip build
  if (!ESBUILDER_REGEX.test(source.ext)) return []

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
  delete options.sourceRoot
  delete options.sourcemap
  delete options.sourcesContent
  delete options.splitting

  // normalize options
  options.absWorkingDir = options.absWorkingDir ?? process.cwd()
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

  // build source
  const { errors, metafile, outputFiles, warnings } = await build({
    ...options,
    entryPoints: [`${entry.source}/${source.file}`],
    format: entry.format,
    loader: {
      '.cjs': entry.format === 'cjs' ? 'copy' : 'js',
      '.cts': 'ts',
      '.d.cts': 'copy',
      '.d.mts': 'copy',
      '.d.ts': 'copy',
      '.js': 'js',
      '.json': 'copy',
      '.json5': 'copy',
      '.jsonc': 'copy',
      '.jsx': 'jsx',
      '.mjs': entry.format === 'esm' ? 'copy' : 'js',
      '.mts': 'ts',
      '.ts': 'ts',
      '.tsx': 'tsx'
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
