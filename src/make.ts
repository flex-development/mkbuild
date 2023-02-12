/**
 * @file Make
 * @module mkbuild/make
 */

import * as mlly from '@flex-development/mlly'
import pathe from '@flex-development/pathe'
import type { PackageJson } from '@flex-development/pkg-types'
import type { Nullable } from '@flex-development/tutils'
import * as color from 'colorette'
import consola from 'consola'
import { pathToFileURL } from 'node:url'
import pb from 'pretty-bytes'
import loadBuildConfig from './config/load'
import type { Config, Entry, Result } from './interfaces'
import { defu, defuConcat, esbuilder } from './internal'
import { IGNORE_PATTERNS, analyzeResults, fs as fsa } from './utils'

/**
 * [esbuild][1] based file-to-file transformer and bundler.
 *
 * [1]: https://esbuild.github.io
 *
 * @todo hooks support
 * @todo include metafile(s) in return value
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
    clean,
    cwd: thisdir,
    entries = [],
    fs,
    ...options
  } = defu(await loadBuildConfig(cwd), config, {
    bundle: false,
    clean: true,
    createRequire: false,
    cwd,
    dts: await (async () => {
      try {
        await mlly.resolveModule('typescript', { parent: pathToFileURL(cwd) })
        return true
      } catch {
        return false
      }
    })(),
    entries: [] as Partial<Entry>[],
    ext: '.mjs',
    format: 'esm',
    fs: fsa,
    ignore: [...IGNORE_PATTERNS],
    outdir: 'dist',
    pattern: '**',
    platform: '',
    source: 'src',
    write: false
  })

  // resolve path to current working directory
  cwd = pathe.resolve(process.cwd(), thisdir)

  /**
   * `package.json` data.
   *
   * @const {Nullable<PackageJson>} pkg
   */
  const pkg: Nullable<PackageJson> = mlly.readPackageJson(cwd)

  // throw if package.json was not found
  if (!pkg) throw new Error(cwd + '/package.json not found')

  // infer entry from config
  if (entries.length === 0) entries.push({ ...options, cwd: cwd })

  /**
   * Normalized build entries.
   *
   * @const {Entry[]} tasks
   */
  const tasks: Entry[] = entries.map(entry => {
    const { peerDependencies = {} } = pkg

    const {
      bundle = options.bundle,
      cwd: entrydir = cwd,
      format = options.format,
      platform = options.platform
    } = entry

    return defuConcat(entry, options, {
      bundle,
      createRequire: bundle && format === 'esm' && platform === 'node',
      cwd: pathe.resolve(cwd, entrydir),
      external: bundle ? Object.keys(peerDependencies) : [],
      format,
      platform,
      source: bundle ? 'src/index' : options.source
    })
  })

  // print build start info
  options.write && consola.info(color.cyan(`Building ${pkg.name}`))

  // clean output directories
  if (options.write && clean) {
    /**
     * Absolute paths to output directories.
     *
     * **Does not include {@linkcode cwd} if it is an output directory**. This
     * prevents the current working directory from being accidentally removed.
     *
     * @const {string[]} outdirs
     */
    const outdirs: string[] = tasks
      .map((entry: Entry): string => pathe.resolve(cwd, entry.outdir))
      .filter(outdir => outdir !== cwd)

    // remove and recreate output directories
    for (const outdir of new Set(outdirs)) {
      // unlink output directory
      await fs.unlink(outdir).catch(() => ({}))

      // try removing output directory
      try {
        await fs.rm(pathe.join(outdir), { recursive: true })
      } catch {}

      // recreate output directory
      await fs.mkdir(outdir, { recursive: true })
    }
  }

  /**
   * Build results map.
   *
   * @const {Map<number, Result[]>} build
   */
  const build: Map<number, Result[]> = new Map<number, Result[]>()

  // process build entries
  for (const [index, entry] of tasks.entries()) {
    build.set(index, [])

    // build source files
    const [, results] = await esbuilder(entry, fs)

    // add build results to build results map
    for (const result of results) build.get(index)!.push(result)
  }

  // print build done info, analysis, and total size
  if (options.write) {
    /**
     * Total build size.
     *
     * @var {number} bytes
     */
    let bytes: number = 0

    // print build done info
    consola.success(color.green(`Build succeeded for ${pkg.name}`))

    // print build analysis
    for (const [index, outputs] of build.entries()) {
      bytes += outputs.reduce((acc, result) => acc + result.bytes, 0)
      consola.log(analyzeResults(tasks[index]!.outdir, outputs))
    }

    // print total build size
    consola.log('Σ Total build size:', color.cyan(pb(bytes)))
  }

  return [...build.entries()].flatMap(([, results]) => results)
}

export default make
