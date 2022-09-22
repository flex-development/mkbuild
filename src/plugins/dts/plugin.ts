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
   * @todo bundle declarations
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
   * @throws {Error}
   */
  const setup = async ({
    initialOptions,
    onEnd,
    onStart
  }: PluginBuild): Promise<void> => {
    const {
      absWorkingDir = process.cwd(),
      entryPoints = [],
      metafile,
      outExtension: { '.js': ext = '.js' } = {},
      outdir = '.'
    } = initialOptions

    // metafile required to get output metadata
    if (!metafile) throw new Error('metafile required')

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
      const { message: text, stack = '' } = new Error('no source files found')
      const [, line, column] = /:(\d+):(\d+)/.exec(stack)!

      return void onStart(() => ({
        warnings: [
          {
            location: {
              column: +column!,
              file: import.meta.url.replace('file://', ''),
              line: +line!,
              lineText: stack.split(`${text}\n`)[1]
            },
            pluginName: PLUGIN_NAME,
            text
          }
        ]
      }))
    }

    // resolve source files
    sourcefiles = sourcefiles.map(file => pathe.resolve(absWorkingDir, file))

    // first letter before "js" in output file extension
    const [cm = ''] = /(?<=^(\.min)?\.)(c|m)(?=[jt]s$)/.exec(ext) ?? []

    /**
     * Regex pattern matching output file extensions.
     *
     * @const {RegExp} OUTPUT_EXT_REGEX
     */
    const OUTPUT_EXT_REGEX: RegExp = /\.(c|m)?(j|t)s$/

    /**
     * Virtual file system for declaration files.
     *
     * @const {Map<string, string>} vfs
     */
    const vfs: Map<string, string> = new Map()

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
      forceConsistentCasingInFileNames: true,
      incremental: true,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.NodeJs,
      outDir: pathe.resolve(absWorkingDir, outdir),
      skipLibCheck: true
    }

    /**
     * TypeScript compiler host.
     *
     * @const {CompilerHost} host
     */
    const host: CompilerHost = ts.createCompilerHost(compilerOptions)

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
    return void onEnd((result: BuildResult): void => {
      return void (result.outputFiles = result.outputFiles!.flatMap(output => {
        /**
         * Absolute path to declaration file for {@link output}.
         *
         * @const {string} dtspath
         */
        const dtspath: string = output.path.replace(OUTPUT_EXT_REGEX, '.d.$1ts')

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
