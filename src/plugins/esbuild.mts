/**
 * @file Plugins - esbuild
 * @module mkbuild/plugins/esbuild
 */

import formatEsbuildMessage from '#internal/format-esbuild-message'
import type WithUndefined from '#types/with-undefined'
import type {
  EsbuildOptions,
  Format
} from '@flex-development/mkbuild'
import pathe from '@flex-development/pathe'
import { ifelse, isNIL } from '@flex-development/tutils'
import { createFilter } from '@rollup/pluginutils'
import { ok } from 'devlop'
import type * as Esbuild from 'esbuild'
import type { Loader, LogLevel, TransformOptions, TsconfigRaw } from 'esbuild'
import type {
  MinimalPluginContext,
  ModuleInfo,
  NormalizedInputOptions,
  NormalizedOutputOptions,
  OutputBundle,
  Plugin,
  PluginContext,
  ProgramNode,
  RenderedChunk,
  RollupLog,
  LogLevel as RollupLogLevel,
  SourceDescription,
  TransformPluginContext,
  TransformResult
} from 'rollup'

/**
 * Plugin name.
 *
 * @internal
 *
 * @const {string} PLUGIN_NAME
 */
const PLUGIN_NAME: string = 'mkbuild:esbuild'

/**
 * esbuild module.
 *
 * @internal
 *
 * @var {typeof Esbuild | undefined} esbuild
 */
let esbuild: typeof Esbuild | undefined

plugin.PLUGIN_NAME = PLUGIN_NAME
export default plugin

/**
 * Plugin options.
 *
 * @internal
 *
 * @extends {EsbuildOptions}
 */
interface Options extends EsbuildOptions {
  /**
   * Module format.
   *
   * @see {@linkcode Format}
   */
  format: Format

  /**
   * Set the value of the `sourceRoot` field in a source map, which specifies
   * the path that all other paths in the source map are relative to. If this
   * field is not present, all paths in the source map are interpreted as being
   * relative to the directory containing the source map instead.
   *
   * @see https://esbuild.github.io/api/#source-root
   */
  sourceRoot?: URL | string | null | undefined

  /**
   * Include the `sourcesContent` field in sourcemaps.
   *
   * @see https://esbuild.github.io/api/#sources-content
   */
  sourcesContent?: boolean | null | undefined
}

/**
 * Create a plugin to transform files with esbuild.
 *
 * @see {@linkcode Options}
 * @see {@linkcode Plugin}
 *
 * @internal
 *
 * @this {void}
 *
 * @param {Options} [opts]
 *  esbuild options
 * @return {Plugin}
 *  esbuild transform plugin
 */
function plugin(this: void, opts: Options): Plugin {
  /**
   * Copied modules.
   *
   * @const {Set<ModuleInfo>} copied
   */
  const copied: Set<ModuleInfo> = new Set<ModuleInfo>()

  /**
   * Module id filter.
   *
   * @const {(id: unknown) => boolean} filter
   */
  const filter: (id: unknown) => boolean = createFilter(
    opts.include ?? /\.(?:(?:json)|(?:[cm]?[jt]s)|(?:[jt]sx?))$/,
    opts.exclude ?? undefined
  )

  /**
   * Raw tsconfig.
   *
   * @var {TsconfigRaw} tsconfigRaw
   */
  let tsconfigRaw: TsconfigRaw

  return {
    buildStart,
    generateBundle,
    name: PLUGIN_NAME,
    onLog,
    renderChunk,
    transform
  }

  /**
   * Get the raw tsconfig from `options`.
   *
   * @this {PluginContext}
   *
   * @param {NormalizedInputOptions} options
   *  Normalized input options
   * @return {undefined}
   */
  function buildStart(
    this: PluginContext,
    options: NormalizedInputOptions
  ): undefined {
    ok(typeof options.tsconfig === 'object', 'expected `options.tsconfig`')
    tsconfigRaw = options.tsconfig as TsconfigRaw
    return void this
  }

  /**
   * Add the content of copied modules to their chunks. Any sourcemaps generated
   * for copied modules will be removed.
   *
   * @see https://rollupjs.org/plugin-development/#generatebundle
   *
   * @this {PluginContext}
   *
   * @param {NormalizedOutputOptions} options
   *  Normalized output options
   * @param {OutputBundle} bundle
   *  Output bundle
   * @return {undefined}
   */
  function generateBundle(
    this: PluginContext,
    options: NormalizedOutputOptions,
    bundle: OutputBundle
  ): undefined {
    for (const output of Object.values(bundle)) {
      for (const info of copied) {
        if (output.type === 'chunk' && output.facadeModuleId === info.id) {
          ok(typeof info.code === 'string', 'expected `info.code`')

          output.code = info.code
          output.map = null

          if (output.sourcemapFileName !== null) {
            delete bundle[output.sourcemapFileName]
            output.sourcemapFileName = null
          }
        }
      }
    }

    return void bundle
  }

  /**
   * Skip `EMPTY_BUNDLE` logs.
   *
   * @see https://rollupjs.org/plugin-development/#onlog
   *
   * @this {MinimalPluginContext}
   *
   * @param {RollupLogLevel} level
   *  Rollup log level
   * @param {RollupLog} log
   *  Rollup log object
   * @return {false | undefined}
   *  `false` if log will be silenced, `undefined` otherwise
   */
  function onLog(
    this: MinimalPluginContext,
    level: RollupLogLevel,
    log: RollupLog
  ): false | undefined {
    return ifelse(log.code === 'EMPTY_BUNDLE', false, void log)
  }

  /**
   * Fix the name and file name of copied modules.
   *
   * @see https://rollupjs.org/plugin-development/#renderchunk
   *
   * @this {PluginContext}
   *
   * @param {string} code
   *  Chunk content
   * @param {RenderedChunk} chunk
   *  The chunk to process
   * @return {undefined}
   */
  function renderChunk(
    this: PluginContext,
    code: string,
    chunk: RenderedChunk
  ): undefined {
    for (const info of copied) {
      if (chunk.facadeModuleId === info.id) {
        chunk.fileName = pathe.changeExt(chunk.fileName, pathe.extname(info.id))
        chunk.name = pathe.changeExt(chunk.fileName, null)
        break
      }
    }

    return void chunk
  }

  /**
   * Transform `code` using the [esbuild transform api][esbuild-transform].
   *
   * [esbuild-transform]: https://esbuild.github.io/api/#transform
   *
   * @see https://rollupjs.org/plugin-development/#transform
   *
   * @todo `globalName`
   * @todo `ignoreAnnotations`
   * @todo `pure`
   * @todo `treeShaking`
   *
   * @this {TransformPluginContext}
   *
   * @param {string} code
   *  The code to transform
   * @param {string} id
   *  The id of the module containing `code`
   * @return {Promise<TransformResult>}
   *  Transform result
   */
  async function transform(
    this: TransformPluginContext,
    code: string,
    id: string
  ): Promise<TransformResult> {
    /**
     * Transform result.
     *
     * @var {WithUndefined<Partial<SourceDescription>> | undefined} result
     */
    let result: WithUndefined<Partial<SourceDescription>> | undefined

    if (filter(id)) {
      /**
       * AST of transformed code.
       *
       * @var {ProgramNode | undefined} ast
       */
      let ast: ProgramNode | undefined

      /**
       * Content loader.
       *
       * @var {Loader | undefined} loader
       */
      let loader: Loader | undefined = pathe.extToValue(pathe.basename(id), {
        '.cjs': 'js',
        '.cts': 'ts',
        '.d.cts': 'copy',
        '.d.mts': 'copy',
        '.d.ts': 'copy',
        '.js': 'js',
        '.json': 'copy',
        '.jsx': 'jsx',
        '.mjs': 'js',
        '.mts': 'ts',
        '.ts': 'ts',
        '.tsx': 'tsx',
        ...opts.loader
      })

      // note: rather than just be a no-op, or work as `empty`, esbuild throws
      // an annoying error when the `copy` loader is used with `transform`.
      if (loader === 'copy') {
        /**
         * Module info.
         *
         * @const {ModuleInfo | null} info
         */
        const info: ModuleInfo | null = this.getModuleInfo(id)

        if (info) {
          copied.add(info)
          info.code = code
        }

        ast = {
          body: [],
          end: 0,
          sourceType: 'module',
          start: 0,
          type: 'Program'
        }

        loader = 'empty'
      }

      const { transform } = esbuild ??= await import('esbuild')

      /**
       * Log level overrides.
       *
       * @const {Record<string, LogLevel>} logOverride
       */
      const logOverride: Record<string, LogLevel> = { ...opts.logOverride }

      ok(typeof opts.sourcesContent === 'boolean', 'expected `sourcesContent`')

      const {
        code: transformed,
        map,
        legalComments,
        mangleCache,
        warnings
      } = await transform(code, {
        charset: opts.charset ?? undefined,
        color: false,
        define: opts.define ?? undefined,
        drop: opts.drop ?? undefined,
        dropLabels: opts.dropLabels ?? undefined,
        format: opts.format,
        jsx: opts.jsx ?? undefined,
        jsxDev: opts.jsxDev ?? undefined,
        jsxFactory: opts.jsxFactory ?? undefined,
        jsxFragment: opts.jsxFragment ?? undefined,
        jsxImportSource: opts.jsxImportSource ?? undefined,
        jsxSideEffects: opts.jsxSideEffects ?? undefined,
        keepNames: opts.keepNames ?? undefined,
        legalComments: 'external',
        lineLimit: opts.lineLimit ?? undefined,
        loader,
        logLevel: 'silent',
        logLimit: 0,
        logOverride: Object
          .entries(logOverride)
          .reduce<Record<string, LogLevel>>((acc, [key, level]) => {
            acc[key] = ifelse(level === 'silent', level, 'warning')
            return acc
          }, {}),
        mangleCache: opts.mangleCache ?? undefined,
        mangleProps: opts.mangleProps ?? undefined,
        mangleQuoted: opts.mangleQuoted ?? undefined,
        minify: opts.minify ?? undefined,
        minifyIdentifiers: opts.minifyIdentifiers ?? undefined,
        minifySyntax: opts.minifySyntax ?? undefined,
        minifyWhitespace: opts.minifyWhitespace ?? undefined,
        platform: opts.platform ?? undefined,
        reserveProps: opts.reserveProps ?? undefined,
        sourceRoot: ifelse(
          isNIL(opts.sourceRoot),
          undefined,
          String(opts.sourceRoot)
        ),
        sourcefile: id,
        sourcemap: true,
        sourcesContent: opts.sourcesContent,
        supported: {
          'dynamic-import': true,
          'import-meta': true,
          ...opts.supported
        },
        target: typeof opts.target === 'object'
          ? [...new Set(opts.target)]
          : opts.target,
        tsconfigRaw: opts.tsconfigRaw ?? tsconfigRaw
      } as TransformOptions)

      for (const message of warnings) {
        /**
         * Message formatted as rollup log.
         *
         * @const {RollupLog} log
         */
        const log: RollupLog = formatEsbuildMessage(
          message,
          code,
          id,
          PLUGIN_NAME,
          logOverride[message.id]
        )

        // log message if not silenced
        log.level && this[log.level](log, log.loc)
      }

      result = {
        ast,
        code: typeof ast === 'object' ? code : transformed,
        map,
        meta: { legalComments, mangleCache, warnings }
      }
    }

    return result as TransformResult
  }
}
