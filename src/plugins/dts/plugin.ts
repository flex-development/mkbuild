/**
 * @file Plugins - dts
 * @module mkbuild/plugins/dts
 */

import defu from '#src/internal/defu'
import type { OutputMetadata } from '#src/types'
import {
  EXT_DTS_REGEX,
  EXT_JS_REGEX,
  EXT_TS_REGEX
} from '@flex-development/ext-regex'
import pathe from '@flex-development/pathe'
import * as tscu from '@flex-development/tsconfig-utils'
import type {
  BuildOptions,
  BuildResult,
  OnResolveArgs,
  OutputFile,
  Plugin,
  PluginBuild
} from 'esbuild'
import util from 'node:util'
import type {
  CompilerHost,
  CompilerOptions,
  WriteFileCallback
} from 'typescript'

/**
 * Returns a TypeScript declaration plugin.
 *
 * @return {Plugin} TypeScript declaration plugin
 */
const plugin = (): Plugin => {
  /**
   * Generates TypeScript declarations.
   *
   * @todo handle diagnostics
   * @todo bundle declarations
   *
   * [1]: https://esbuild.github.io/plugins
   * [2]: https://esbuild.github.io/api/#build-api
   *
   * @async
   *
   * @param {PluginBuild} build - [esbuild plugin api][1]
   * @param {BuildOptions} build.initialOptions - [esbuild build api][2] options
   * @param {PluginBuild['onEnd']} build.onEnd - Build end cb
   * @param {PluginBuild['onResolve']} build.onResolve - Path resolution cb
   * @return {Promise<void>} Nothing when complete
   * @throws {Error}
   */
  const setup = async ({
    initialOptions,
    onEnd,
    onResolve
  }: PluginBuild): Promise<void> => {
    const {
      absWorkingDir = process.cwd(),
      bundle,
      color = true,
      format,
      metafile,
      outExtension: { '.js': ext = '.js' } = {},
      outbase = '',
      outdir = '.',
      preserveSymlinks = false,
      tsconfig = 'tsconfig.json',
      write
    } = initialOptions

    // not bundling declarations yet
    if (bundle) return void bundle

    // esbuild write must be disabled to access result.outputFiles
    if (write) throw new Error('write must be disabled')

    // metafile required to get output metadata
    if (!metafile) throw new Error('metafile required')

    /**
     * TypeScript module.
     *
     * @const {typeof import('typescript')} ts
     */
    const ts: typeof import('typescript') = (await import('typescript')).default

    /**
     * Absolute paths to source files.
     *
     * @const {string[]} sourcefiles
     */
    const sourcefiles: string[] = []

    /**
     * Source file filter.
     *
     * @const {RegExp} filter
     */
    const filter: RegExp = new RegExp(
      (
        `(?:(?:${EXT_JS_REGEX.source.slice(0, -8)})` +
        `|(?:${EXT_TS_REGEX.source.slice(0, -8)}))$`
      ).replace(/\?<.+?>/g, '?:')
    )

    // get source files as entry points are resolved
    onResolve({ filter }, (args: OnResolveArgs): undefined => {
      return void sourcefiles.push(pathe.resolve(args.resolveDir, args.path))
    })

    return void onEnd((result: BuildResult): void => {
      /**
       * TypeScript compiler options.
       *
       * @var {CompilerOptions | tscu.CompilerOptions} compilerOptions
       */
      let compilerOptions: CompilerOptions | tscu.CompilerOptions =
        tscu.loadCompilerOptions(pathe.resolve(absWorkingDir, tsconfig))

      // normalize compiler options
      compilerOptions = tscu.normalizeCompilerOptions(compilerOptions)

      // remove forbidden compiler options
      delete compilerOptions.declarationDir
      delete compilerOptions.out
      delete compilerOptions.outFile
      delete compilerOptions.rootDirs
      delete compilerOptions.sourceMap
      delete compilerOptions.sourceRoot

      // remove overridden compiler options
      delete compilerOptions.declaration
      delete compilerOptions.emitDeclarationOnly
      delete compilerOptions.noEmit
      delete compilerOptions.noErrorTruncation
      delete compilerOptions.outDir
      delete compilerOptions.rootDir

      // remove unsupported compiler options
      delete compilerOptions.declarationMap
      delete compilerOptions.noEmitOnError

      // merge compiler options with defaults
      compilerOptions = defu(compilerOptions, {
        allowJs: true,
        allowUmdGlobalAccess: format === 'iife',
        allowUnreachableCode: false,
        baseUrl: absWorkingDir,
        checkJs: false,
        declaration: true,
        declarationMap: false,
        emitDeclarationOnly: true,
        esModuleInterop: true,
        forceConsistentCasingInFileNames: true,
        isolatedModules: true,
        module: ts.ModuleKind.ESNext,
        moduleResolution: tscu.normalizeModuleResolution(
          tscu.ModuleResolutionKind.NodeJs
        ),
        noEmit: false,
        noEmitOnError: false,
        noErrorTruncation: true,
        noImplicitAny: true,
        noImplicitOverride: true,
        noImplicitReturns: true,
        outDir: pathe.resolve(absWorkingDir, outdir),
        preserveConstEnums: true,
        preserveSymlinks,
        pretty: color,
        resolveJsonModule: true,
        rootDir: pathe.resolve(absWorkingDir, outbase),
        skipLibCheck: true,
        target: ts.ScriptTarget.ESNext
      })

      /**
       * TypeScript compiler host.
       *
       * @const {CompilerHost} host
       */
      const host: CompilerHost = ts.createCompilerHost(compilerOptions)

      /**
       * Virtual file system for declaration files.
       *
       * @const {Map<string, string>} vfs
       */
      const vfs: Map<string, string> = new Map()

      // first letter before "js" or "ts" in output file extension
      const [, cm = ''] = /\.(c|m)?[jt]sx?$/.exec(ext)!

      /**
       * Writes a declaration file to {@linkcode vfs}.
       *
       * @param {string} filename - Name of file to write
       * @param {string} contents - Content to write
       * @return {void} Nothing when complete
       */
      const writeFile: WriteFileCallback = (
        filename: string,
        contents: string
      ): void => {
        return void vfs.set(
          filename.replace(EXT_DTS_REGEX, `.d.${cm}ts`),
          contents
        )
      }

      // override write file function
      host.writeFile = writeFile

      // emit declarations to virtual file system
      ts.createProgram(
        sourcefiles.filter(sourcefile => !EXT_DTS_REGEX.test(sourcefile)),
        compilerOptions,
        host
      ).emit()

      // remap output files to insert declaration file outputs
      return void (result.outputFiles = result.outputFiles!.flatMap(output => {
        /**
         * Absolute path to declaration file for {@linkcode output}.
         *
         * @const {string} dtspath
         */
        const dtspath: string = EXT_JS_REGEX.test(output.path)
          ? output.path.replace(EXT_JS_REGEX, '.d.$1ts')
          : EXT_TS_REGEX.test(output.path) && !EXT_DTS_REGEX.test(output.path)
          ? output.path.replace(EXT_TS_REGEX, '.d.$2ts')
          : ''

        // do nothing if missing declaration file
        if (!vfs.has(dtspath)) return [output]

        /**
         * Relative path to output file.
         *
         * **Note**: Relative to {@linkcode absWorkingDir}.
         *
         * @const {string} outfile
         */
        const outfile: string = output.path
          .replace(absWorkingDir, '')
          .replace(/^\//, '')

        /**
         * {@linkcode output} metadata.
         *
         * @const {OutputMetadata} metadata
         */
        const metadata: OutputMetadata = result.metafile!.outputs[outfile]!

        /**
         * Declaration output file content.
         *
         * @const {string} dtstext
         */
        const dtstext: string = vfs.get(dtspath)!

        /**
         * Declaration file output.
         *
         * @const {OutputFile} dts
         */
        const dts: OutputFile = {
          contents: new util.TextEncoder().encode(dtstext),
          path: dtspath,
          text: dtstext
        }

        /**
         * Relative path to declaration output file.
         *
         * **Note**: Relative to {@linkcode absWorkingDir}.
         *
         * @const {string} dtsoutfile
         */
        const dtsoutfile: string = dtspath
          .replace(absWorkingDir, '')
          .replace(/^\//, '')

        // update metafile
        result.metafile!.outputs[dtsoutfile] = {
          ...metadata,
          bytes: Buffer.byteLength(dts.contents)
        }

        return [output, dts]
      }))
    })
  }

  return { name: 'dts', setup }
}

export default plugin
