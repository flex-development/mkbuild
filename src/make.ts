/**
 * @file Make
 * @module mkbuild/make
 */

import { ERR_MODULE_NOT_FOUND, type NodeError } from '@flex-development/errnode'
import * as mlly from '@flex-development/mlly'
import pathe from '@flex-development/pathe'
import type { PackageJson } from '@flex-development/pkg-types'
import type { Nullable } from '@flex-development/tutils'
import * as color from 'colorette'
import consola from 'consola'
import type * as esbuild from 'esbuild'
import regexp from 'escape-string-regexp'
import { asyncExitHook as exitHook } from 'exit-hook'
import { fileURLToPath } from 'node:url'
import pb from 'pretty-bytes'
import loadBuildConfig from './config/load'
import type { Config, Context, Result, Task } from './interfaces'
import { createContext, defu, defuConcat } from './internal'
import type { OutputMetadata } from './types'
import { analyzeOutputs, fs as fsa } from './utils'

/**
 * [esbuild][1] based file-to-file transformer and bundler.
 *
 * [1]: https://esbuild.github.io
 *
 * @todo hooks support
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
 * @throws {esbuild.BuildFailure | NodeError}
 */
async function make({
  configfile = true,
  cwd = '.',
  ...config
}: Config = {}): Promise<Result[]> {
  const { entries, fs, watch, write, ...options } = defu(
    config,
    configfile ? await loadBuildConfig(cwd) : {},
    {
      cwd,
      entries: [{}] as Partial<Task>[],
      fs: fsa,
      logLevel: 'info',
      outdir: 'dist',
      watch: false,
      write: false
    }
  )

  /**
   * Absolute path to current working directory.
   *
   * @const {string} absWorkingDir
   */
  const absWorkingDir: string = pathe.resolve(options.cwd)

  /**
   * `package.json` data.
   *
   * @const {Nullable<PackageJson>} pkg
   */
  const pkg: Nullable<PackageJson> = mlly.readPackageJson(absWorkingDir)

  // throw if package.json was not found
  if (!pkg) {
    throw new ERR_MODULE_NOT_FOUND(
      pathe.join(absWorkingDir, 'package.json'),
      fileURLToPath(import.meta.url),
      'module'
    )
  }

  // print build start info
  if (watch || write) {
    consola.info(color.cyan(`${watch ? 'Watching' : 'Building'} ${pkg.name}`))
  }

  /**
   * Build tasks.
   *
   * @const {Task[]} tasks
   */
  const tasks: Task[] = entries.map(entry => {
    const {
      bundle = options.bundle,
      cwd = options.cwd,
      outdir = options.outdir,
      source = options.source ?? (bundle ? 'src/index' : 'src'),
      ...rest
    } = entry

    return defuConcat(
      {
        bundle,
        cwd,
        outdir,
        source,
        write
      },
      rest,
      options
    )
  })

  /**
   * Build results.
   *
   * @const {Result[]} results
   */
  const results: Result[] = []

  /**
   * Build context.
   *
   * @var {Context} context
   */
  let context: Context

  // enable watch mode or do static build
  if (watch) {
    const [task] = tasks as [Task]

    // force clean output directory when watch mode is enabled
    task.clean = true

    // disable declaration file generation when watch mode is enabled
    task.dts = false

    // force writing output files if watch mode is enabled
    task.write = true

    // create build context
    context = await createContext(task, pkg, fs)

    // watch source files
    await context.watch()

    // dispose build context on process exit
    exitHook(context.dispose.bind(context), { minimumWait: 10 })
  } else {
    // process build tasks
    for (const task of tasks) {
      // create build context
      context = await createContext(task, pkg, fs)

      /**
       * esbuild build result.
       *
       * @const {esbuild.BuildResult<{ metafile: true; write: false }>} result
       */
      const result: esbuild.BuildResult<{ metafile: true; write: false }> =
        await context.rebuild()

      // add build results
      results.push({
        cwd: pathe.resolve(task.cwd),
        errors: result.errors,
        mangleCache: result.mangleCache,
        metafile: result.metafile,
        outdir: task.outdir,
        outputs: result.outputFiles.map(output => {
          /**
           * Relative path to output file.
           *
           * **Note**: Relative to {@linkcode absWorkingDir}.
           *
           * @const {string} outfile
           */
          const outfile: string = output.path
            .replace(new RegExp('^' + regexp(absWorkingDir)), '')
            .replace(/^\//, '')

          /**
           * Output metadata.
           *
           * @const {OutputMetadata} metadata
           */
          const metadata: OutputMetadata = result.metafile.outputs[outfile]!

          return {
            bytes: metadata.bytes,
            contents: output.contents,
            entryPoint: metadata.entryPoint,
            exports: [...new Set(metadata.exports)],
            imports: metadata.imports,
            outfile,
            path: output.path,
            text: output.text
          }
        }),
        warnings: result.warnings
      })

      // dispose build context
      await context.dispose()
    }

    // print build done info, output analysis, and total size
    if (write) {
      /**
       * Total build size (in bytes).
       *
       * @var {number} size
       */
      let size: number = 0

      // print build done info
      consola.success(color.green(`Build succeeded for ${pkg.name}`))

      // print build output analysis and update total build size
      for (const { outdir, metafile } of results) {
        const { analysis, bytes } = analyzeOutputs(outdir, metafile.outputs)
        size += bytes
        consola.log(analysis)
      }

      // print total build size
      consola.log('Σ Total build size:', color.cyan(pb(size)))
    }
  }

  return results
}

export default make
