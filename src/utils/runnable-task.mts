/**
 * @file Utilities - runnableTask
 * @module mkbuild/utils/runnableTask
 */

import createEntryFileNames from '#internal/create-entry-file-names'
import createOnLog from '#internal/create-on-log'
import formatLog from '#internal/format-log'
import dfs from '#internal/fs'
import glob from '#internal/glob'
import loadTsconfig from '#internal/load-tsconfig'
import readPackageJson from '#internal/read-package-json'
import toPath from '#internal/to-path'
import withTrailingSlash from '#internal/with-trailing-slash'
import clean from '#plugins/clean'
import dts from '#plugins/dts'
import esbuild from '#plugins/esbuild'
import metadata from '#plugins/metadata'
import resolve from '#plugins/resolve'
import write from '#plugins/write'
import type WithUndefined from '#types/with-undefined'
import formatToExt from '#utils/format-to-ext'
import gitignore from '#utils/gitignore'
import IGNORE_PATTERNS from '#utils/ignore-patterns'
import TASK_PLUGIN_NAME from '#utils/task-plugin-name'
import { createLogger, type Logger } from '@flex-development/log'
import { FancyReporter } from '@flex-development/log/reporters'
import type {
  Failure,
  FileSystem,
  Format,
  Input,
  LogType,
  Message,
  OutputAsset,
  OutputChunk,
  Result,
  RunnableTask,
  Task
} from '@flex-development/mkbuild'
import pathe from '@flex-development/pathe'
import type { PackageJson } from '@flex-development/pkg-types'
import { ifelse, isNIL, ksort } from '@flex-development/tutils'
import { ok } from 'devlop'
import {
  rollup,
  type InputOptions,
  type InputPluginOption,
  type LogLevelOption,
  type MinimalPluginContext,
  type NormalizedInputOptions,
  type NormalizedOutputOptions,
  type OutputOptions,
  type PluginContext,
  type RollupBuild,
  type RollupCache
} from 'rollup'
import { createMerger } from 'smob'

/**
 * Create a runnable build task.
 *
 * @see {@linkcode FileSystem}
 * @see {@linkcode RunnableTask}
 * @see {@linkcode Task}
 *
 * @category
 *  utils
 *
 * @this {void}
 *
 * @param {Task | null | undefined} [task]
 *  The build task to handle
 * @param {Partial<FileSystem> | null | undefined} [fs]
 *  File system API
 * @return {RunnableTask}
 *  Runnable build task
 */
function runnableTask(
  this: void,
  task?: Task | null | undefined,
  fs?: Partial<FileSystem> | null | undefined
): RunnableTask {
  task ??= {}
  fs = { ...dfs, ...fs }

  /**
   * Build task logger.
   *
   * @const {Logger} logger
   */
  const logger: Logger = createLogger({
    format: { badge: false },
    reporters: new FancyReporter()
  })

  /**
   * Rollup cache.
   *
   * @var {RollupCache | undefined} cache
   */
  let cache: RollupCache | undefined

  /**
   * Entry points.
   *
   * @var {Input | undefined} input
   */
  let input: Input | undefined

  /**
   * Build messages.
   *
   * @var {Message[]} messages
   */
  let messages: Message[]

  /**
   * Package manifest.
   *
   * @var {PackageJson} pkg
   */
  let pkg: PackageJson

  /**
   * Input plugins.
   *
   * @var {InputPluginOption[]} plugins
   */
  let plugins: InputPluginOption[]

  return ksort(Object.assign({}, task, { run }) as RunnableTask)

  /**
   * Attach additional data to `options`.
   *
   * @see https://rollupjs.org/plugin-development/#buildstart
   *
   * @async
   *
   * @this {PluginContext}
   *
   * @param {NormalizedInputOptions} options
   *  Normalized input options
   * @return {Promise<undefined>}
   */
  async function buildStart(
    this: PluginContext,
    options: NormalizedInputOptions
  ): Promise<undefined> {
    ok(fs, 'expected `fs`')
    ok(task, 'expected `task`')
    ok(typeof task.bundle === 'boolean', 'expected `task.bundle`')
    ok(typeof task.root === 'string', 'expected `task.root`')

    options.bundle = task.bundle
    options.fs = fs as FileSystem
    options.pkg = pkg
    options.root = task.root

    options.tsconfig = createMerger({ priority: 'right' })(await loadTsconfig({
      cwd: task.root,
      fs: options.fs,
      tsconfig: task.tsconfig,
      tsconfigRaw: task.tsconfigRaw
    }), {
      compilerOptions: {
        noEmit: false,
        noEmitOnError: false,
        noErrorTruncation: true
      }
    })

    return void this
  }

  /**
   * Set input options.
   *
   * @see https://rollupjs.org/plugin-development/#options
   *
   * @this {MinimalPluginContext}
   *
   * @param {{ plugins?: InputPluginOption }} options
   *  Options passed to `rollup`
   * @return {WithUndefined<InputOptions>}
   *  Rollup input options
   */
  function options(
    this: MinimalPluginContext,
    options: { plugins?: InputPluginOption }
  ): WithUndefined<InputOptions> {
    ok(task, 'expected `task`')
    ok(typeof task.format === 'string', 'expected `task.format`')
    ok(typeof task.logLevel === 'string', 'expected `task.logLevel`')
    ok(typeof task.root === 'string', 'expected `task.root`')
    ok(Array.isArray(options.plugins), 'expected `options.plugins`')

    const { cacheExpiry, logSideEffects, perf } = task.experimental ?? {}
    plugins = []

    task.dts ??= Object.keys({ ...pkg.devDependencies }).includes('typescript')
    task.gitignore ??= true
    task.ignore ??= new Set(IGNORE_PATTERNS)
    task.sourcemapExcludeSources ??= true
    task.strictDeprecations ??= true

    if (Array.isArray(input) || typeof input === 'string') {
      input = glob({
        fs,
        ignore: new Set([
          ...task.gitignore ? gitignore(task.root, fs) : [],
          ...task.ignore
        ]),
        include: input,
        root: task.root
      })
    }

    plugins.push(
      ...options.plugins,
      task.plugins,
      resolve({ ...task.resolve }),
      task.esbuild !== false &&
        task.format !== 'system' &&
        task.format !== 'umd' &&
        esbuild({
          ...task.esbuild,
          format: task.format,
          globalName: task.globalName,
          sourceRoot: task.sourcemapBaseUrl,
          sourcesContent: !task.sourcemapExcludeSources,
          treeShaking: !!task.bundle && task.treeshake !== false
        }),
      task.dts && dts({ only: task.dts === 'only', path: task.typescriptPath }),
      metadata(),
      clean(),
      write()
    )

    return {
      cache,
      context: typeof task.moduleContext !== 'string'
        ? undefined
        : task.moduleContext,
      experimentalCacheExpiry: cacheExpiry ?? 10,
      experimentalLogSideEffects: logSideEffects ?? false,
      external: task.bundle && task.resolve?.external || undefined,
      input,
      jsx: false,
      logLevel: ({
        debug: 'debug',
        error: 'warn',
        info: 'info',
        silent: 'debug',
        trace: 'debug',
        verbose: 'debug',
        warn: 'warn'
      } as Record<LogLevelOption | LogType, LogLevelOption>)[task.logLevel],
      makeAbsoluteExternalsRelative:
        task.resolve?.makeAbsoluteExternalsRelative ?? 'ifRelativeSource',
      maxParallelFileOps: task.maxParallelFileOps ?? 20,
      moduleContext: typeof task.moduleContext !== 'string'
        ? task.moduleContext ?? undefined
        : undefined,
      onLog: createOnLog(messages, logger),
      perf: perf ?? undefined,
      plugins,
      preserveEntrySignatures: task.preserveEntrySignatures ?? 'exports-only',
      preserveSymlinks: task.resolve?.preserveSymlinks ?? false,
      shimMissingExports: task.shimMissingExports ?? false,
      strictDeprecations: task.strictDeprecations,
      treeshake: task.treeshake ?? true,
      watch: false
    }
  }

  /**
   * Compare the filenames of `a` and `b`.
   *
   * @param {OutputAsset | OutputChunk} a
   *  First output asset or chunk
   * @param {OutputAsset | OutputChunk} b
   *  Second output asset or chunk
   * @return {number}
   *  Comparison result
   */
  function outputCompare(
    a: OutputAsset | OutputChunk,
    b: OutputAsset | OutputChunk
  ): number {
    return a.fileName.localeCompare(b.fileName)
  }

  /**
   * Set output options.
   *
   * @see https://rollupjs.org/plugin-development/#outputoptions
   *
   * @this {MinimalPluginContext}
   *
   * @return {WithUndefined<OutputOptions>}
   *  Rollup output options
   */
  function outputOptions(
    this: MinimalPluginContext
  ): WithUndefined<OutputOptions> {
    ok(task, 'expected `task`')
    ok(typeof task.format === 'string', 'expected `task.format`')
    ok(typeof task.outdir === 'string', 'expected `task.outdir`')
    ok(typeof task.root === 'string', 'expected `task.root`')
    ok(pathe.isAbsolute(task.root), 'expected `task.root` to be absolute')

    task.assetFileNames ??= 'assets/[name][extname]'
    task.clean ??= true
    task.entryFileNames ??= '[name]{extname}'
    task.sanitizeFileName ??= true
    task.write ??= false

    if (!task.ext) task.ext = formatToExt(task.format)
    task.ext = pathe.formatExt(task.ext)

    return {
      assetFileNames: task.assetFileNames,
      banner: task.banner ?? undefined,
      compact: task.compact ?? false,
      dir: task.outdir,
      dynamicImportInCjs: task.dynamicImportInCjs ?? true,
      entryFileNames: createEntryFileNames(task),
      esModule: task.esModule ?? 'if-default-prop',
      experimentalMinChunkSize: task.experimental?.minChunkSize ?? 1,
      exports: task.exports ?? 'auto',
      extend: task.globalExtend ?? false,
      externalImportAttributes: task.externalImportAttributes ?? true,
      externalLiveBindings: task.externalLiveBindings ?? true,
      footer: task.footer ?? undefined,
      format: task.format,
      freeze: task.freeze ?? true,
      generatedCode: task.generatedCode ?? 'es5',
      hashCharacters: task.hashCharacters ?? 'base64',
      hoistTransitiveImports: task.hoistTransitiveImports ?? true,
      importAttributesKey: task.importAttributesKey ?? 'with',
      indent: task.indent ?? true,
      inlineDynamicImports: task.inlineDynamicImports ?? false,
      interop: task.interop ?? 'default',
      minifyInternalExports: task.minifyInternalExports ?? undefined,
      name: task.globalName ?? undefined,
      noConflict: task.noConflict ?? false,
      preserveModules: !task.bundle,
      preserveModulesRoot: task.root.slice(1),
      reexportProtoFromExternal: task.reexportProtoFromExternal ?? true,
      sanitizeFileName: task.sanitizeFileName,
      sourcemap: task.sourcemap ?? undefined,
      sourcemapBaseUrl: ifelse(
        isNIL(task.sourcemapBaseUrl),
        undefined,
        String(task.sourcemapBaseUrl)
      ),
      sourcemapExcludeSources: task.sourcemapExcludeSources!,
      sourcemapIgnoreList: task.sourcemapIgnoreList ?? undefined,
      sourcemapPathTransform: task.sourcemapPathTransform ?? undefined,
      strict: task.strict ?? true,
      systemNullSetters: task.systemNullSetters ?? true,
      validate: task.validate ?? undefined,
      virtualDirname: task.virtualDirname ?? undefined
    }
  }

  /**
   * Attach additional data to `output` options.
   *
   * @see https://rollupjs.org/plugin-development/#renderstart
   *
   * @this {PluginContext}
   *
   * @param {NormalizedOutputOptions} output
   *  Normalized output options
   * @param {NormalizedInputOptions} input
   *  Normalized input options
   * @return {undefined}
   */
  function renderStart(
    this: PluginContext,
    output: NormalizedOutputOptions,
    input: NormalizedInputOptions
  ): undefined {
    ok(input.fs, 'expected `input.fs`')
    ok(task, 'expected `task`')
    ok(typeof input.bundle === 'boolean', 'expected `input.bundle`')
    ok(typeof task.clean === 'boolean', 'expected `task.clean`')
    ok(typeof task.root === 'string', 'expected `task.root`')
    ok(typeof task.write === 'boolean', 'expected `task.write`')

    output.clean = task.clean
    output.bundle = input.bundle
    output.fs = input.fs
    output.root = task.root
    output.write = task.write

    return void this
  }

  /**
   * Run {@linkcode task}.
   *
   * @async
   *
   * @return {Promise<Result>}
   *  Build result
   */
  async function run(): Promise<Result> {
    ok(fs, 'expected `fs`')
    ok(task, 'expected `task`')

    task.bundle = !!task.bundle
    task.root = toPath(task.root ?? pathe.cwd())
    task.root = withTrailingSlash(pathe.resolve(task.root))

    input = task.input ?? undefined
    messages = []

    logger.level = task.logLevel ??= 'info'
    task.outdir ??= 'dist'

    /**
     * Build result.
     *
     * @const {Result} result
     */
    const result: Result = Object.defineProperties({
      bundle: task.bundle,
      failure: null,
      format: '' as unknown as Format,
      logger,
      messages,
      outdir: task.outdir,
      outputs: [],
      pkg: {},
      root: task.root,
      size: 0,
      task: task as Result['task'],
      timings: null
    }, {
      logger: {
        enumerable: false
      },
      size: {
        enumerable: true,

        /**
         * Get the size of `this` build result.
         *
         * @this {Result}
         *
         * @return {number}
         *  Build result size in bytes
         */
        get(this: Result): number {
          return this.outputs.reduce((acc, output) => {
            ok(typeof output.bytes === 'number', 'expected `output.bytes`')
            return acc + output.bytes
          }, 0)
        }
      }
    })

    pkg = result.pkg = readPackageJson(result.root, fs as FileSystem) ?? {}
    result.format = task.format ??= pkg.type === 'module' ? 'esm' : 'cjs'
    Object.defineProperties(result, { pkg: { enumerable: false } })

    try {
      /**
       * Rollup build.
       *
       * @const {RollupBuild} build
       */
      const build: RollupBuild = await rollup({
        plugins: [
          {
            api: { fs, pkg: result.pkg },
            // @ts-expect-error [2353] vite-only option
            apply: 'build',
            buildStart: { handler: buildStart, order: 'pre', sequential: true },
            name: TASK_PLUGIN_NAME,
            onLog: { handler: formatLog, order: 'pre' },
            options: { handler: options, order: 'pre', sequential: true },
            outputOptions: { handler: outputOptions, order: 'pre' },
            renderStart: { handler: renderStart, order: 'pre' }
          }
        ]
      })

      // store cache
      cache = build.cache

      // generate rollup build outputs and add outputs to build result
      result.outputs = (await build.generate({})).output.sort(outputCompare)

      // close rollup build so `closeBundle` hooks are called
      void await build.close()

      // add performance timings to build result
      if (build.getTimings) result.timings = build.getTimings()
    } catch (e: unknown) {
      ok(e instanceof Error, 'expected error instance')
      formatLog('error', e)
      result.failure = e as unknown as Failure
    }

    // rollup will throw if `task.input` is empty, `null`, or `undefined`
    if (result.failure?.message.match(/must supply options.input to rollup/)) {
      result.failure = null
    }

    ok(Array.isArray(plugins), 'expected `plugins`')

    result.task.input = input
    result.task.plugins = plugins

    return ksort(result.task), result
  }
}

export default runnableTask
