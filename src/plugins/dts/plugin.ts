/**
 * @file Plugins - dts
 * @module mkbuild/plugins/dts
 */

import {
  EXT_DTS_REGEX,
  EXT_JS_REGEX,
  EXT_TS_REGEX
} from '#src/config/constants'
import type { OutputMetadata } from '#src/types'
import type {
  BuildOptions,
  BuildResult,
  OutputFile,
  Plugin,
  PluginBuild
} from 'esbuild'
import fse from 'fs-extra'
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
      entryPoints = [],
      metafile
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
     * Source file paths.
     *
     * @var {string[]} sourcefiles
     */
    let sourcefiles: string[] = Array.isArray(entryPoints)
      ? entryPoints
      : Object.values(entryPoints)

    // filter out files that aren't javascript or typescript
    // if typescript, filter out declaration files
    sourcefiles = sourcefiles.filter(sourcefile => {
      return (
        (EXT_JS_REGEX.test(sourcefile) || EXT_TS_REGEX.test(sourcefile)) &&
        !EXT_DTS_REGEX.test(sourcefile)
      )
    })

    // send warning message if no source files are found
    if (sourcefiles.length === 0) {
      return void onStart(() => ({
        warnings: [{ pluginName: PLUGIN_NAME, text: 'no source files found' }]
      }))
    }

    /**
     * Source file paths and content.
     *
     * @const {[string, string][]} sources
     */
    const sources: [string, string][] = sourcefiles.map(sourcefile => [
      pathe.resolve(absWorkingDir, sourcefile),
      fse.readFileSync(sourcefile, 'utf8')
    ])

    /**
     * Virtual file system.
     *
     * @const {Map<string, string>} vfs
     */
    const vfs: Map<string, string> = new Map(sources)

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

    /**
     * Reads a file from {@link vfs}.
     *
     * Fallbacks to reading from the filesystem if `filename` isn't found.
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

    // override read and write file functions
    host.readFile = readFile
    host.writeFile = writeFile

    // emit declarations to virtual file system
    ts.createProgram([...vfs.keys()], compilerOptions, host).emit()

    // remap output files to insert declaration file outputs
    return void onEnd((result: BuildResult): void => {
      return void (result.outputFiles = result.outputFiles!.flatMap(output => {
        /**
         * Output file extension.
         *
         * @const {string} output_ext
         */
        const output_ext: string = pathe.extname(output.path)

        // do nothing if output file isn't javascript or typescript
        if (!EXT_JS_REGEX.test(output_ext) && !EXT_TS_REGEX.test(output_ext)) {
          return [output]
        }

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
         * Relative path to source file.
         *
         * **Note**: Relative to {@link absWorkingDir}.
         *
         * @const {string | undefined} entryPoint
         */
        const entryPoint: string | undefined =
          // because this is a custom plugin for this project, the use cases for
          // this plugin can be narrowed down so that only a single entry point
          // is ever passed to entryPoints (and possibly sourcefiles)
          metadata.entryPoint ?? sourcefiles[0]!

        // no entry point => source file was not js or ts, or was a dts file
        /* c8 ignore next */ if (!entryPoint) return [output]
        /* c8 ignore next 6 */
        /**
         * Declaration filename.
         *
         * @const {string} dtsfile
         */
        const dtsfile: string = pathe
          .resolve(absWorkingDir, entryPoint)
          .replace(/\.(c|m)?(j|t)s$/, '.d.$1ts')

        /**
         * Declaration file content.
         *
         * @const {string} declarations
         */
        const declarations: string = vfs.get(dtsfile)!

        // first letter before "js" in output file extension
        const [cm = ''] = /(?<=^\.)(c|m)(?=[jt]s$)/.exec(output_ext) ?? []

        /**
         * Output extension regex.
         *
         * @const {RegExp} extregex
         */
        const extregex: RegExp = new RegExp('\\' + output_ext + '$')

        /**
         * Declaration file output.
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
