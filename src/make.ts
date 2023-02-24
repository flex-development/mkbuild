/**
 * @file Make
 * @module mkbuild/make
 */

import { ERR_MODULE_NOT_FOUND } from '@flex-development/errnode'
import * as mlly from '@flex-development/mlly'
import pathe from '@flex-development/pathe'
import type { PackageJson } from '@flex-development/pkg-types'
import type { Nullable } from '@flex-development/tutils'
import * as color from 'colorette'
import consola from 'consola'
import { fileURLToPath } from 'node:url'
import pb from 'pretty-bytes'
import { omit } from 'radash'
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
async function make({
  configfile = true,
  cwd = '.',
  ...config
}: Config = {}): Promise<Result[]> {
  const {
    clean,
    cwd: thisdir,
    entries = [],
    fs,
    ...options
  } = defu(configfile ? await loadBuildConfig(cwd) : {}, config, {
    bundle: false,
    clean: true,
    cwd,
    dts: await (async () => {
      try {
        await mlly.resolveModule(
          pathe.resolve(cwd, 'node_modules', 'typescript', 'package.json')
        )
        return true
      } catch {
        return false
      }
    })(),
    entries: [] as Partial<Entry>[],
    ext: '',
    format: 'esm',
    fs: fsa,
    ignore: await (async () => {
      /**
       * Ignore patterns.
       *
       * @const {Set<string>} ignore
       */
      const ignore: Set<string> = IGNORE_PATTERNS

      // try adding ignore patterns from .gitignore
      try {
        /**
         * Absolute path to `.gitignore` file.
         *
         * @const {string} gip
         */
        const gip: string = pathe.resolve(cwd, '.gitignore')

        /**
         * `.gitignore` file content.
         *
         * @const {string} gitignore
         */
        const gitignore: string = (await mlly.getSource(gip)) as string

        // add ignore patterns from .gitignore
        for (const line of gitignore.split(/\r?\n/)) {
          if (!line.trim()) continue
          if (line.startsWith('#') || line.startsWith('!')) continue
          ignore.add(line.trim())
        }
      } catch {}

      return [...ignore]
    })(),
    outdir: 'dist',
    pattern: '**',
    source: '',
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
  if (!pkg) {
    throw new ERR_MODULE_NOT_FOUND(
      pathe.join(cwd, 'package.json'),
      fileURLToPath(import.meta.url),
      'module'
    )
  }

  // print build start info
  options.write && consola.info(color.cyan(`Building ${pkg.name}`))

  // push empty object to infer entry from config if initial array is empty
  if (entries.length === 0) entries.push({})

  /**
   * Normalized build entries.
   *
   * @const {Entry[]} tasks
   */
  const tasks: Entry[] = entries.map(entry => {
    const { peerDependencies = {} } = pkg

    const {
      bundle = options.bundle,
      cwd: thiscwd = cwd,
      ext = options.ext as string,
      format = options.format,
      platform = options.platform,
      source = options.source
    } = entry

    return defuConcat(entry, omit(options, ['ext', 'source']), {
      createRequire: bundle && format === 'esm' && platform === 'node',
      cwd: pathe.resolve(cwd, thiscwd),
      ext:
        ext || (format === 'cjs' ? '.cjs' : format === 'esm' ? '.mjs' : '.js'),
      external: bundle ? Object.keys(peerDependencies) : [],
      source: source || (bundle ? 'src/index' : 'src')
    })
  })

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
    const [, results] = await esbuilder(entry, pkg, fs)

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
