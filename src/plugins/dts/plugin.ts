/**
 * @file Plugins - dts
 * @module mkbuild/plugins/dts
 */

import type {
  BuildOptions,
  BuildResult,
  OutputFile,
  Plugin,
  PluginBuild
} from 'esbuild'
import fse from 'fs-extra'
import { findExportNames } from 'mlly'
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
   * [1]: https://esbuild.github.io/plugins
   * [2]: https://esbuild.github.io/api/#build-api
   *
   * @async
   *
   * @param {PluginBuild} build - [esbuild plugin api][1]
   * @param {BuildOptions} build.initialOptions - [esbuild build api][2] options
   * @param {PluginBuild['onEnd']} build.onEnd - Build end callback
   * @param {PluginBuild['onStart']} build.onStart - Build start callback
   * @return {Promise<void>} Nothing when complete
   */
  const setup = async ({
    initialOptions,
    onEnd,
    onStart
  }: PluginBuild): Promise<void> => {
    const {
      absWorkingDir = process.cwd(),
      metafile,
      outExtension: { '.js': ext = '.js' } = {}
    } = initialOptions

    // metafile required to get output metadata
    if (!metafile) {
      return void onStart(() => ({
        errors: [
          {
            detail: 'https://esbuild.github.io/api/#metafile',
            pluginName: PLUGIN_NAME,
            text: 'metafile required'
          }
        ]
      }))
    }

    /**
     * TypeScript module.
     *
     * @const {typeof import('typescript')} ts
     */
    const ts: typeof import('typescript') = (await import('typescript')).default

    /**
     * TypeScript compiler options.
     *
     * @const {CompilerOptions} compilerOptions
     */
    const compilerOptions: CompilerOptions = {
      allowJs: true,
      declaration: true,
      emitDeclarationOnly: true,
      incremental: true,
      skipLibCheck: true
    }

    /**
     * TypeScript compiler host.
     *
     * @const {CompilerHost} host
     */
    const host: CompilerHost = ts.createCompilerHost(compilerOptions)

    /**
     * Original `host.readFile` function.
     *
     * @const {CompilerHost['readFile']} _readFile
     */
    const _readFile: CompilerHost['readFile'] = host.readFile.bind(host)

    // generate declarations
    return void onEnd(async (result: BuildResult): Promise<void> => {
      /**
       * Source file paths and content.
       *
       * @const {[string, string][]} sources
       */
      const sources: [string, string][] = []

      // get sources
      for (const output of result.outputFiles!) {
        /**
         * Relative path to output file.
         *
         * **Note**: Relative to {@link absWorkingDir}.
         *
         * @const {string} outfile
         */
        const outfile: string = output.path.replace(absWorkingDir + '/', '')

        /**
         * Relative path to source file.
         *
         * **Note**: Relative to {@link absWorkingDir}.
         *
         * @const {string} source
         */
        const source: string = result.metafile!.outputs[outfile]!.entryPoint!

        /**
         * Absolute path to source file.
         *
         * @const {string} sourcefile
         */
        const sourcefile: string = pathe.resolve(absWorkingDir, source)

        // add source
        sources.push([sourcefile, await fse.readFile(sourcefile, 'utf8')])
      }

      /**
       * Virtual file system.
       *
       * @const {Map<string, string>} vfs
       */
      const vfs: Map<string, string> = new Map(sources)

      /**
       * Reads a file from {@link vfs}.
       *
       * @param {string} filename - Name of file to write
       * @return {string | undefined} File content
       */
      const readFile = (filename: string): string | undefined => {
        return vfs.get(filename) ?? _readFile(filename)
      }

      /**
       * Writes a file to {@link vfs}.
       *
       * @param {string} filename - Name of file to write
       * @param {string} contents - Content to write
       * @return {void} Nothing when complete
       */
      const writeFile: WriteFileCallback = (
        filename: string,
        contents: string
      ): void => void vfs.set(filename, contents)

      host.readFile = readFile
      host.writeFile = writeFile

      // emit declarations to virtual file system
      ts.createProgram([...vfs.keys()], compilerOptions, host).emit()

      // remap output files to insert declaration file outputs
      return void (result.outputFiles = result.outputFiles!.flatMap(output => {
        /**
         * Relative path to output file.
         *
         * **Note**: Relative to {@link absWorkingDir}.
         *
         * @const {string} outfile
         */
        const outfile: string = output.path.replace(absWorkingDir + '/', '')

        /**
         * Relative path to source file.
         *
         * **Note**: Relative to {@link absWorkingDir}.
         *
         * @const {string} source
         */
        const source: string = result.metafile!.outputs[outfile]!.entryPoint!

        /**
         * Absolute path to source file.
         *
         * @const {string} sourcefile
         */
        const sourcefile: string = pathe.resolve(absWorkingDir, source)

        /**
         * Declaration filename.
         *
         * @const {string} dtsfile
         */
        const dtsfile: string = sourcefile.replace(/\.(c|m)?(j|t)s$/, '.d.$1ts')

        /**
         * Declaration file content.
         *
         * @const {string} declarations
         */
        const declarations: string = vfs.get(dtsfile)!

        // first letter before "js" in output file extension
        const [cm = ''] = /(?<=^\.)(c|m)(?=[jt]s$)/.exec(ext) ?? []

        /**
         * Output extension regex.
         *
         * @const {RegExp} extregex
         */
        const extregex: RegExp = new RegExp('\\' + ext + '$')

        /**
         * Declaration file output object.
         *
         * @const {OutputFile} dts
         */
        const dts: OutputFile = {
          contents: new Uint8Array(Buffer.from(declarations)),
          path: output.path.replace(extregex, `.d.${cm}ts`),
          text: declarations
        }

        // update metafile
        result.metafile!.outputs[outfile.replace(extregex, `.d.${cm}ts`)] = {
          ...result.metafile!.outputs[outfile]!,
          bytes: dts.contents.byteLength,
          exports: findExportNames(declarations)
        }

        return [output, dts]
      }))
    })
  }

  return { name: PLUGIN_NAME, setup }
}

export default plugin
