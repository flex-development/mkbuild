/**
 * @file Make
 * @module mkbuild/make
 */

import type { PackageJson } from '@flex-development/pkg-types'
import * as color from 'colorette'
import consola from 'consola'
import { defu } from 'defu'
import type { Format } from 'esbuild'
import fse from 'fs-extra'
import * as pathe from 'pathe'
import pb from 'pretty-bytes'
import { EXT_DTS_REGEX, IGNORE_PATTERNS } from './config/constants'
import loadBuildConfig from './config/load'
import type { Config, Entry, Result } from './interfaces'
import type { OutputExtension } from './types'
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
async function make({
  absWorkingDir: cwd = '.',
  ...config
}: Config = {}): Promise<Result[]> {
  const {
    absWorkingDir,
    bundle,
    clean,
    createRequire,
    dts,
    entries: bentries = [],
    ext,
    format,
    fs,
    ignore,
    name,
    outdir,
    pattern,
    source,
    ...esbuild
  } = defu(await loadBuildConfig(cwd), config, {
    absWorkingDir: cwd,
    bundle: false,
    clean: true,
    createRequire: false,
    dts: fse.existsSync(pathe.resolve(cwd, 'node_modules/typescript')),
    entries: [] as Partial<Entry>[],
    ext: '.mjs' as OutputExtension,
    format: 'esm' as Format,
    fs: fse,
    ignore: IGNORE_PATTERNS,
    name: undefined,
    outdir: 'dist',
    pattern: '**',
    source: 'src'
  })

  // determine current working directory
  cwd = pathe.resolve(process.cwd(), absWorkingDir)

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

  // infer entry from config
  if (bentries.length === 0) {
    bentries.push({
      ...esbuild,
      absWorkingDir: cwd,
      bundle,
      createRequire,
      dts,
      ext,
      format,
      ignore,
      name,
      outdir,
      pattern,
      source
    })
  }

  /**
   * Normalized build entries.
   *
   * @const {Entry[]} entries
   */
  const entries: Entry[] = bentries.map(entry => {
    const { peerDependencies = {} } = pkg

    entry.absWorkingDir = pathe.resolve(cwd, entry.absWorkingDir ?? cwd)
    entry.bundle = entry.bundle ?? bundle
    entry.format = entry.format ?? format
    entry.platform = entry.platform ?? esbuild.platform
    entry.source = entry.source ?? (entry.bundle ? 'src/index' : 'src')

    if (entry.bundle && entry.format === 'esm' && entry.platform === 'node') {
      entry.createRequire = true
    }

    return defu(entry, esbuild, {
      createRequire,
      dts,
      ext: (entry.format === 'esm' ? '.mjs' : '.js') as Entry['ext'],
      external: Object.keys(peerDependencies),
      format,
      ignore,
      name,
      outdir,
      pattern
    }) as Entry
  })

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
      return pathe.resolve(cwd, entry.outdir)
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
  for (const entry of entries) {
    /**
     * Build results for {@link entry}.
     *
     * @var {Result[]} results
     */
    let results: Result[] = []

    // attempt to build source files
    try {
      results = await esbuilder(entry, fs)
    } catch {
      return []
    }

    // filter results if only declaration files should be written
    if (entry.dts === 'only') {
      results = results.filter(result => EXT_DTS_REGEX.test(result.outfile))
    }

    // write build results
    for (const result of results) {
      try {
        await write(result, fs)
      } catch (e: unknown) {
        consola.error((e as Error).message)
        return []
      }
    }

    // push written build results
    written.push([entry.outdir, results])
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
