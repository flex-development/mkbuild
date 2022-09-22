/**
 * @file Make
 * @module mkbuild/make
 */

import * as color from 'colorette'
import consola from 'consola'
import { defu } from 'defu'
import type { Format } from 'esbuild'
import fse from 'fs-extra'
import * as pathe from 'pathe'
import { type PackageJson } from 'pkg-types'
import pb from 'pretty-bytes'
import { IGNORE_PATTERNS } from './config/constants'
import loadBuildConfig from './config/load'
import type { Config, Entry, Result } from './interfaces'
import type { EsbuildOptions, OutputExtension } from './types'
import analyzeResults from './utils/analyze-results'
import buildSources from './utils/build-sources'
import esbuilder from './utils/esbuilder'
import write from './utils/write'

/**
 * [esbuild][1] based file-to-file transformer and bundler.
 *
 * [1]: https://esbuild.github.io
 *
 * @todo validate build results against package.json
 *
 * @async
 *
 * @example
 *  await make({ entries: [{}] })
 * @example
 *  await make({ entries: [{ ext: '.mjs', format: 'esm' }] })
 * @example
 *  await make({ entries: [{ ext: '.cjs', format: 'cjs' }] })
 * @example
 *  await make({ entries: [{ ext: '.js', format: 'iife' }] })
 *
 * @param {Config} [config={}] - Build configuration options
 * @return {Promise<Result[]>} Build results
 */
async function make({ cwd = '.', ...config }: Config = {}): Promise<Result[]> {
  const {
    bundle,
    clean,
    cwd: root,
    declaration,
    entries,
    esbuild,
    format,
    fs,
    ignore,
    outdir,
    pattern
  }: Required<Config> = defu(await loadBuildConfig(cwd), config, {
    bundle: false,
    clean: true,
    cwd,
    declaration: true,
    entries: [],
    esbuild: {} as EsbuildOptions,
    ext: '.mjs' as OutputExtension,
    format: 'esm' as Format,
    fs: fse,
    ignore: IGNORE_PATTERNS,
    outdir: 'dist',
    pattern: '**',
    source: 'src'
  })

  // determine current working directory
  cwd = pathe.resolve(process.cwd(), root)

  /**
   * `package.json` data.
   *
   * @var {PackageJson} pkg
   */
  let pkg: PackageJson

  // attempt to read package.json
  try {
    pkg = await fs.readJson(pathe.resolve(cwd, 'package.json'))
  } catch {
    consola.error('package.json not found')
    return []
  }

  // normalize build entries
  for (const $ of entries) {
    const { peerDependencies = {} } = pkg

    $.absWorkingDir = cwd

    /**
     * Normalized build entry.
     *
     * @const {Entry} entry
     */
    const entry: Entry = defu($, esbuild, {
      bundle,
      declaration,
      ext: (($.format ?? format) === 'esm' ? '.mjs' : '.js') as OutputExtension,
      external: Object.keys(peerDependencies),
      format,
      name: undefined,
      outbase: 'src',
      outdir,
      source: $.bundle ?? bundle ? 'src/index' : 'src'
    })

    // reassign entry properties
    for (const [key, value] of Object.entries(entry)) $[key] = value
  }

  // print build start info
  consola.info(color.cyan(`Building ${pkg.name}`))

  // clean output directories
  if (clean) {
    /**
     * Output directory paths.
     *
     * @const {string[]} outdirs
     */
    const outdirs: string[] = entries.map(entry => {
      return pathe.resolve(cwd, entry.outdir!)
    })

    // remove and recreate output directories
    for (const outdir of new Set(outdirs)) {
      await fs.unlink(outdir).catch(() => ({}))
      await fs.emptyDir(outdir)
      await fs.mkdirp(outdir)
    }
  }

  /**
   * Written build results.
   *
   * @const {[string, Result[]][]} written
   */
  const written: [string, Result[]][] = []

  // process build entries
  for (const entry of entries as Entry[]) {
    /**
     * Build results for {@link entry}.
     *
     * @const {Result[]} built
     */
    const built: Result[] = []

    // build source files and write results
    for (const source of await buildSources(entry, pattern, ignore, fs)) {
      /**
       * Build results for {@link source}.
       *
       * @var {Result[]} results
       */
      let results: Result[] = []

      // attempt to build source file
      try {
        results = await esbuilder(source, entry)
      } catch {
        return []
      }

      // write build results
      for (const result of results) {
        try {
          built.push(await write(result, fs))
        } catch (e: unknown) {
          consola.error((e as Error).message)
          return []
        }
      }
    }

    // push written build results
    written.push([entry.outdir, built])
  }

  /**
   * Total build size.
   *
   * @var {number} bytes
   */
  let bytes: number = 0

  // print build done info
  consola.success(color.green(`Build succeeded for ${pkg.name}`))

  // print build analysis
  for (const [outdir, results] of written) {
    bytes += results.reduce((acc, result) => acc + result.bytes, 0)
    consola.log(analyzeResults(outdir, results))
  }

  // print total build size
  consola.log('Σ Total build size:', color.cyan(pb(bytes)))

  return written.flatMap(([, results]) => results)
}

export default make
