/**
 * @file Make
 * @module mkbuild/make
 */

import * as color from 'colorette'
import consola from 'consola'
import { defu } from 'defu'
import type { Format } from 'esbuild'
import fse from 'fs-extra'
import { globby } from 'globby'
import { isNotJunk } from 'junk'
import * as pathe from 'pathe'
import type { PackageJson } from 'pkg-types'
import pb from 'pretty-bytes'
import {
  EXT_DTS_REGEX,
  EXT_TS_REGEX,
  IGNORE_PATTERNS
} from './config/constants'
import loadBuildConfig from './config/load'
import type { Config, Entry, Result, SourceFile } from './interfaces'
import type { EsbuildOptions, OutputExtension } from './types'
import analyzeResults from './utils/analyze-results'
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
async function make({ cwd, ...config }: Config = {}): Promise<Result[]> {
  /**
   * Written build results.
   *
   * @const {[string, Result[]][]} written
   */
  const written: [string, Result[]][] = []

  // determine current working directory
  cwd = pathe.resolve(process.cwd(), cwd ?? '.')

  try {
    const {
      bundle,
      clean,
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

    /**
     * Absolute path to `package.json`.
     *
     * @const {string} pkgfile
     */
    const pkgfile: string = pathe.resolve(cwd, 'package.json')

    /**
     * `package.json` data.
     *
     * @const {PackageJson} pkg
     */
    const pkg: PackageJson = await fs.readJson(pkgfile)

    // normalize build entry options
    for (const entry of entries) {
      /**
       * Fully configured build entry.
       *
       * @const {Entry} ent
       */
      const ent: Entry = defu(entry, esbuild, {
        bundle,
        declaration: declaration && format !== 'iife',
        ext: (format === 'esm' ? '.mjs' : '.js') as OutputExtension,
        external: Object.keys(pkg.peerDependencies ?? {}),
        format,
        name: undefined,
        outdir,
        source: bundle ? 'src/index' : 'src'
      })

      // reassign entry properties
      for (const [key, value] of Object.entries(ent)) entry[key] = value
      entry.absWorkingDir = cwd
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
        return pathe.resolve(cwd!, entry.outdir!)
      })

      // remove and recreate output directories
      for (const outdir of new Set(outdirs)) {
        await fs.unlink(outdir).catch(() => ({}))
        await fs.emptyDir(outdir)
        await fs.mkdirp(outdir)
      }
    }

    // process build entries
    for (const entry of entries as Entry[]) {
      /**
       * Build results for {@link entry}.
       *
       * @const {Result[]} results
       */
      const results: Result[] = []

      /**
       * Source file paths.
       *
       * **Note**: Relative to `entry.source`.
       *
       * @const {string[]} sourcefiles
       */
      const sourcefiles: string[] = await globby(pattern, {
        cwd: entry.source,
        dot: true,
        fs,
        ignore
      })

      /**
       * Source file objects.
       *
       * @const {SourceFile[]} sources
       */
      const sources: SourceFile[] = sourcefiles.filter(isNotJunk).map(file => {
        /**
         * {@link file} resolved.
         *
         * @const {string} path
         */
        const path: string = pathe.resolve(entry.source, file)

        /**
         * {@link file} extension.
         *
         * @var {string} ext
         */
        let ext: string = pathe.extname(path)

        // fix extension if file is a typescript declaration file
        if (EXT_TS_REGEX.test(ext) && EXT_DTS_REGEX.test(file)) ext = '.d' + ext

        return { ext, file, path }
      })

      // build sources and write results
      for (const source of sources) {
        /**
         * Build results for {@link source}.
         *
         * @const {Result[]} outputs
         */
        const outputs: Result[] = await esbuilder(source, entry)

        // write build results
        for (const result of outputs) results.push(await write(result, fs))
      }

      // push written results
      written.push([pathe.basename(entry.outdir), results])
    }

    /**
     * Total number of bytes in {@link written}.
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
  } catch (e: unknown) {
    consola.error(e)
  }

  return written.flatMap(([, results]) => results)
}

export default make
