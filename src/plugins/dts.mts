/**
 * @file Plugins - dts
 * @module mkbuild/plugins/dts
 */

import formatDiagnostic from '#internal/format-diagnostic'
import withTrailingSlash from '#internal/with-trailing-slash'
import type { InputFile } from '@flex-development/mkbuild'
import pathe from '@flex-development/pathe'
import {
  createGetCanonicalFileName as canonicalFileName,
  createParseConfigHost,
  type ModuleResolutionHost,
  type ParseConfigHost
} from '@flex-development/tsconfig-utils'
import { constant, noop } from '@flex-development/tutils'
import { ok } from 'devlop'
import json5 from 'json5'
import { SourceMap } from 'magic-string'
import type {
  EmittedAsset,
  EmittedPrebuiltChunk,
  MinimalPluginContext,
  NormalizedInputOptions,
  NormalizedOutputOptions,
  OutputAsset,
  OutputBundle,
  OutputChunk,
  Plugin,
  PluginContext,
  RollupLog
} from 'rollup'
import type {
  CreateSourceFileOptions,
  Diagnostic,
  EmitResult,
  Program,
  ScriptTarget,
  SourceFile,
  default as TypeScript
} from 'typescript'

/**
 * Plugin name.
 *
 * @internal
 *
 * @const {string} PLUGIN_NAME
 */
const PLUGIN_NAME: string = 'mkbuild:dts'

/**
 * TypeScript module.
 *
 * @internal
 *
 * @var {typeof TypeScript | undefined} ts
 */
let ts: typeof TypeScript | undefined

plugin.PLUGIN_NAME = PLUGIN_NAME
export default plugin

/**
 * Plugin configuration options.
 *
 * @internal
 */
interface Options {
  /**
   * Remove non-declaration files from the output bundle.
   *
   * Source maps will be preserved.
   */
  only?: boolean | null | undefined

  /**
   * Path to TypeScript module directory.
   */
  path?: string | null | undefined
}

/**
 * Create a plugin to generate TypeScript declarations.
 *
 * @internal
 *
 * @this {void}
 *
 * @param {Options} opts
 *  Plugin options
 * @return {Plugin}
 *  TypeScript declaration plugin
 */
function plugin(this: void, opts: Options): Plugin {
  /**
   * Record mapping facade module ids to declaration output file names.
   *
   * @const {Map<string, string>} files
   */
  const files: Map<string, string> = new Map<string, string>()

  return { generateBundle, name: PLUGIN_NAME, renderStart }

  /**
   * Log diagnostics.
   *
   * @this {MinimalPluginContext}
   *
   * @param {ReadonlyArray<Diagnostic>} diagnostics
   *  The list of diagnostics to handle
   * @param {typeof TypeScript} ts
   *  TypeScript module
   * @return {undefined}
   */
  function diagnostics(
    this: MinimalPluginContext,
    diagnostics: readonly Diagnostic[],
    ts: typeof TypeScript
  ): undefined {
    for (const diagnostic of diagnostics) {
      /**
       * Diagnostic as rollup log.
       *
       * @const {RollupLog} log
       */
      const log: RollupLog = formatDiagnostic(
        diagnostic,
        PLUGIN_NAME,
        renderStart.name,
        ts
      )

      ok(typeof log.level === 'string', 'expected `log.level`')
      this[log.level](log)
    }

    return void diagnostics
  }

  /**
   * Update declaration output chunks and filter `bundle` if required.
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
      if (
        'code' in output &&
        output.facadeModuleId &&
        output.isEntry &&
        files.has(output.facadeModuleId)
      ) {
        /**
         * Declaration output file name.
         *
         * @const {string} dtsFileName
         */
        const dtsFileName: string | undefined = files.get(output.facadeModuleId)

        ok(typeof dtsFileName === 'string', 'expected `dtsFileName`')

        /**
         * Declaration output.
         *
         * @const {OutputAsset | OutputChunk} dtsOutput
         */
        const dtsOutput: OutputAsset | OutputChunk = bundle[dtsFileName]!

        ok(dtsOutput, 'expected `dtsOutput`')
        ok('code' in dtsOutput, 'expected `dtsOutput` to be chunk')

        dtsOutput.exports = output.exports
        dtsOutput.facadeModuleId = output.facadeModuleId + '?dts'
        dtsOutput.importedBindings = output.importedBindings
        dtsOutput.imports = output.imports
        dtsOutput.moduleIds = output.moduleIds
        dtsOutput.modules = output.modules
        dtsOutput.name = pathe.changeExt(dtsOutput.fileName, null)
        dtsOutput.referencedFiles = output.referencedFiles

        if (dtsOutput.map) {
          dtsOutput.sourcemapFileName = pathe.addExt(dtsFileName, 'map')
        }
      }

      // remove outputs that are not declaration files or declaration maps
      if (opts.only && !/\.d\.[cm]?ts(?:\.map)?$/.test(output.fileName)) {
        delete bundle[output.fileName]
      }
    }

    return void this
  }

  /**
   * Get a source file by `fileName`.
   *
   * @this {ModuleResolutionHost}
   *
   * @param {string} fileName
   *  Source file name
   * @param {CreateSourceFileOptions | ScriptTarget} options
   *  Script target or source file creation options
   * @return {SourceFile | undefined}
   *  Source file or `undefined`
   */
  function getSourceFile(
    this: ModuleResolutionHost,
    fileName: string,
    options: CreateSourceFileOptions | ScriptTarget
  ): SourceFile | undefined {
    /**
     * File contents.
     *
     * @const {string | undefined} contents
     */
    const contents: string | undefined = this.readFile(fileName)

    /**
     * Source file.
     *
     * @var {SourceFile | undefined} sourceFile
     */
    let sourceFile: SourceFile | undefined

    if (contents !== undefined) {
      ok(ts, 'expected `ts`')

      sourceFile = ts.createSourceFile(
        this.realpath(fileName),
        contents,
        options
      )
    }

    return sourceFile
  }

  /**
   * Emit declaration files.
   *
   * @see https://rollupjs.org/plugin-development/#renderstart
   *
   * @this {PluginContext}
   *
   * @async
   *
   * @param {NormalizedOutputOptions} output
   *  Normalized output options
   * @param {NormalizedInputOptions} input
   *  Normalized input options
   * @return {Promise<undefined>}
   */
  async function renderStart(
    this: PluginContext,
    output: NormalizedOutputOptions,
    input: NormalizedInputOptions
  ): Promise<undefined> {
    ok(typeof output.dir === 'string', 'expected `output.dir`')
    ok(typeof input.tsconfig === 'object', 'expected `input.tsconfig`')
    ok(typeof input.root === 'string', 'expected `input.root`')

    // load typescript module
    ts ??= (await import('typescript')).default

    /**
     * List of files to pass to the TypeScript program.
     *
     * @const {string[]} rootNames
     */
    const inputs: InputFile[] = Object.values(input.input)

    /**
     * Path to TypeScript module.
     *
     * @const {string} path
     */
    const path: string = opts.path ?? pathe.resolve('node_modules/typescript')

    /**
     * Parse config host.
     *
     * @const {ParseConfigHost} pch
     */
    const pch: ParseConfigHost = createParseConfigHost({
      fs: input.fs,
      root: input.root
    })

    // normalize tsconfig
    const {
      errors: configFileParsingDiagnostics,
      fileNames,
      options: compilerOptions,
      projectReferences = []
    } = ts.parseJsonConfigFileContent(input.tsconfig, {
      ...pch,
      readDirectory: constant(inputs),
      trace: trace.bind(this)
    }, input.root)

    compilerOptions.declaration = true
    compilerOptions.emitDeclarationOnly = true
    compilerOptions.outDir = pathe.join(output.root, output.dir)
    compilerOptions.outDir = withTrailingSlash(compilerOptions.outDir)

    delete compilerOptions.declarationDir

    /**
     * Declaration map store.
     *
     * @const {Map<string, SourceMap>} maps
     */
    const maps: Map<string, SourceMap> = new Map()

    /**
     * TypeScript program.
     *
     * @const {Program} program
     */
    const program: Program = ts.createProgram({
      configFileParsingDiagnostics,
      host: {
        directoryExists: pch.directoryExists,
        fileExists: pch.fileExists,
        getCanonicalFileName: canonicalFileName(pch.useCaseSensitiveFileNames),
        getCurrentDirectory: pch.getCurrentDirectory,
        getDefaultLibFileName: ts.getDefaultLibFileName,
        getDefaultLibLocation: constant(pathe.join(path, 'lib')),
        getDirectories: constant([]),
        getNewLine: constant('\n'),
        getSourceFile: getSourceFile.bind(pch),
        readDirectory: constant([]),
        readFile: pch.readFile,
        realpath: pch.realpath,
        trace: trace.bind(this),
        useCaseSensitiveFileNames: constant(pch.useCaseSensitiveFileNames),
        writeFile: noop
      },
      options: compilerOptions,
      projectReferences,
      rootNames: fileNames
    })

    // handle pre-emit diagnostics
    diagnostics.call(this, ts.getPreEmitDiagnostics(program), ts)

    // generate declaration files and sourcemaps
    for (const id of inputs) {
      /**
       * TypeScript source file.
       *
       * @const {SourceFile | undefined} sourceFile
       */
      const sourceFile: SourceFile | undefined = program.getSourceFile(id)

      ok(sourceFile, 'expected `sourceFile`')

      /**
       * Emit result.
       *
       * @const {EmitResult} emit
       */
      const emit: EmitResult = program.emit(
        sourceFile,
        writeFile.bind(this),
        undefined,
        true
      )

      // handle emit diagnostics
      diagnostics.call(this, emit.diagnostics, ts)
    }

    return void this

    /**
     * @this {PluginContext}
     *
     * @param {string} fileName
     *  Filename of source file
     * @param {string} contents
     *  File contents
     * @param {boolean} bom
     *  Write byte order mark?
     * @param {((message: string) => void) | undefined} [onError]
     *  Error message handler
     * @param {ReadonlyArray<SourceFile> | undefined} [sourceFiles]
     *  List of source files
     * @return {undefined}
     */
    function writeFile(
      this: PluginContext,
      fileName: string,
      contents: string,
      bom: boolean,
      onError?: ((message: string) => void) | undefined,
      sourceFiles?: readonly SourceFile[] | undefined
    ): undefined {
      ok(typeof compilerOptions.outDir === 'string', 'expected `outDir`')
      ok(Array.isArray(sourceFiles), 'expected `sourceFiles`')

      const [sourceFile] = sourceFiles
      ok(sourceFile, 'expected `sourceFile`')

      fileName = fileName.slice(compilerOptions.outDir.length)

      /**
       * The file to emit.
       *
       * @var {EmittedAsset | EmittedPrebuiltChunk} file
       */
      let file: EmittedAsset | EmittedPrebuiltChunk

      if (pathe.extname(fileName) === '.map') {
        file = {
          fileName,
          needsCodeReference: false,
          originalFileName: sourceFile.fileName,
          source: contents,
          type: 'asset'
        }

        maps.set(fileName, new SourceMap(json5.parse(contents)))
      } else {
        file = { code: contents, exports: [], fileName, type: 'prebuilt-chunk' }
        files.set(sourceFile.fileName, fileName)

        if (compilerOptions.declarationMap) {
          file.sourcemapFileName = fileName + '.map'

          /**
           * Declaration map.
           *
           * @const {SourceMap | undefined} map
           */
          const map: SourceMap | undefined = maps.get(file.sourcemapFileName)

          ok(map, 'expected sourcemap')
          file.map = map
        }
      }

      return void this.emitFile(file)
    }
  }

  /**
   * Handle `message`.
   *
   * @this {MinimalPluginContext}
   *
   * @param {string} message
   *  Formatted diagnostic message or message describing the resolution process
   * @return {undefined}
   */
  function trace(this: MinimalPluginContext, message: string): undefined {
    return void this.debug({
      message,
      meta: this.meta,
      plugin: PLUGIN_NAME,
      pluginCode: trace.name
    })
  }
}
