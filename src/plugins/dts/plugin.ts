/**
 * @file Plugins - dts
 * @module mkbuild/plugins/dts
 */

import { EXT_DTS_REGEX } from '#src/config/constants'
import type { OutputMetadata } from '#src/types'
import getCompilerOptions from '#src/utils/get-compiler-options'
import { defu } from 'defu'
import type {
  BuildOptions,
  BuildResult,
  OnResolveArgs,
  OutputFile,
  Plugin,
  PluginBuild
} from 'esbuild'
import * as pathe from 'pathe'
import type {
  CompilerHost,
  CompilerOptions,
  WriteFileCallback
} from 'typescript'

/**
 * Plugin name.
 *
 * @const {string} PLUGIN_NAME
 */
const PLUGIN_NAME: string = 'dts'

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
      format,
      metafile,
      outExtension: { '.js': ext = '.js' } = {},
      outbase = '',
      outdir = '.',
      tsconfig = 'tsconfig.json'
    } = initialOptions

    // not bundling declarations yet
    if (bundle) return

    // metafile required to get output metadata
    if (!metafile) throw new Error('metafile required')

    /**
     * TypeScript module.
     *
     * @const {typeof import('typescript')} ts
     */
    const ts: typeof import('typescript') = (await import('typescript')).default

    /**
     * Source file paths.
     *
     * @const {string[]} sourcefiles
     */
    const sourcefiles: string[] = []

    /**
     * Source file filter.
     *
     * @const {RegExp} filter
     */
    const filter: RegExp = /(.*[^.d]\.(([cm]?[jt]s)|([jt]sx)))$/

    // get source files as entry points are resolved
    onResolve({ filter }, (args: OnResolveArgs): undefined => {
      return void sourcefiles.push(pathe.resolve(args.resolveDir, args.path))
    })

    return void onEnd((result: BuildResult): void => {
      // do nothing if no source files to process
      if (sourcefiles.length === 0) return

      /**
       * TypeScript compiler options.
       *
       * @var {CompilerOptions} compilerOptions
       */
      let compilerOptions: CompilerOptions = getCompilerOptions(
        pathe.resolve(absWorkingDir, tsconfig),
        ts
      )

      // remove forbidden user compiler options
      delete compilerOptions.declarationDir
      delete compilerOptions.out
      delete compilerOptions.outFile
      delete compilerOptions.rootDirs

      // remove overridden user compiler options
      delete compilerOptions.declaration
      delete compilerOptions.emitDeclarationOnly
      delete compilerOptions.noEmit
      delete compilerOptions.noErrorTruncation
      delete compilerOptions.outDir
      delete compilerOptions.rootDir

      // remove unsupported user compiler options
      delete compilerOptions.declarationMap
      delete compilerOptions.noEmitOnError

      // merge user compiler options with defaults
      compilerOptions = defu(compilerOptions, {
        allowJs: true,
        allowUmdGlobalAccess: format === 'iife',
        allowUnreachableCode: false,
        baseUrl: '.',
        checkJs: false,
        declaration: true,
        declarationMap: false,
        emitDeclarationOnly: true,
        esModuleInterop: true,
        forceConsistentCasingInFileNames: true,
        isolatedModules: true,
        module: ts.ModuleKind.ESNext,
        moduleResolution: ts.ModuleResolutionKind.NodeJs,
        noEmit: false,
        noEmitOnError: false,
        noErrorTruncation: true,
        noImplicitAny: true,
        noImplicitOverride: true,
        noImplicitReturns: true,
        outDir: pathe.resolve(absWorkingDir, outdir),
        preserveConstEnums: true,
        preserveSymlinks: true,
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
      const [cm = ''] = /(?!=^\.\w?\.)(c|m)(?=[jt]s$)/.exec(ext) ?? []

      /**
       * Writes a declaration file to {@link vfs}.
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
      ts.createProgram(sourcefiles, compilerOptions, host).emit()

      // remap output files to insert declaration file outputs
      return void (result.outputFiles = result.outputFiles!.flatMap(output => {
        /**
         * Regex pattern matching output file extensions.
         *
         * @const {RegExp} extregex
         */
        const extregex: RegExp = /\.(c|m)?(j|t)s$/

        /**
         * Absolute path to declaration file for {@link output}.
         *
         * @const {string} dtspath
         */
        const dtspath: string = output.path.replace(extregex, '.d.$1ts')

        // do nothing if missing declaration file
        if (!vfs.has(dtspath)) return [output]

        /**
         * Relative path to output file.
         *
         * **Note**: Relative to {@link absWorkingDir}.
         *
         * @const {string} outfile
         */
        const outfile: string = output.path.replace(absWorkingDir + '/', '')

        /**
         * {@link output} metadata.
         *
         * @const {OutputMetadata} metadata
         */
        const metadata: OutputMetadata = result.metafile!.outputs[outfile]!

        /**
         * Declaration file content.
         *
         * @const {string} declarations
         */
        const declarations: string = vfs.get(dtspath)!

        /**
         * Declaration file output.
         *
         * @const {OutputFile} dts
         */
        const dts: OutputFile = {
          contents: new Uint8Array(Buffer.from(declarations)),
          path: dtspath,
          text: declarations
        }

        // update metafile
        result.metafile!.outputs[dtspath.replace(absWorkingDir + '/', '')] = {
          ...metadata,
          bytes: Buffer.byteLength(dts.contents)
        }

        return [output, dts]
      }))
    })
  }

  return { name: PLUGIN_NAME, setup }
}

export default plugin
