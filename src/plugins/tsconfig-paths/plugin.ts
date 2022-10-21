/**
 * @file Plugins - tsconfig-paths
 * @module mkbuild/plugins/tsconfig-paths/plugin
 */

import { EXT_JS_REGEX, EXT_TS_REGEX } from '#src/config/constants'
import type { OutputMetadata } from '#src/types'
import getCompilerOptions from '#src/utils/get-compiler-options'
import { resolveAliases, RESOLVE_EXTENSIONS } from '@flex-development/mlly'
import type {
  BuildOptions,
  BuildResult,
  OutputFile,
  Plugin,
  PluginBuild
} from 'esbuild'
import * as pathe from 'pathe'
import type Options from './options'

/**
 * Returns a [`tsconfig-paths`][1] plugin.
 *
 * [1]: https://github.com/dividab/tsconfig-paths
 *
 * @param {Options} [options={}] - Plugin options
 * @return {Plugin} `tsconfig-paths` plugin
 */
const plugin = ({
  extensions = RESOLVE_EXTENSIONS,
  fileExists,
  mainFields = ['main', 'module'],
  readFile
}: Options = {}): Plugin => {
  /**
   * Resolves path aliases in output file content.
   *
   * [1]: https://github.com/dividab/tsconfig-paths
   * [2]: https://esbuild.github.io/plugins
   * [3]: https://esbuild.github.io/api/#build-api
   *
   * @param {PluginBuild} build - [esbuild plugin api][2]
   * @param {BuildOptions} build.initialOptions - [esbuild build api][3] options
   * @param {PluginBuild['onEnd']} build.onEnd - Build end callback
   * @return {void} Nothing when complete
   * @throws {Error}
   */
  const setup = ({ initialOptions, onEnd }: PluginBuild): void => {
    const {
      absWorkingDir = process.cwd(),
      bundle,
      metafile,
      tsconfig = 'tsconfig.json'
    } = initialOptions

    // esbuild handles path aliases when bundling
    if (bundle) return

    // metafile required to get output metadata
    if (!metafile) throw new Error('metafile required')

    /**
     * Absolute path to tsconfig.
     *
     * @const {string} tsconfigfile
     */
    const tsconfigpath: string = pathe.resolve(absWorkingDir, tsconfig)

    // user compiler options
    const { baseUrl = '', paths = {} } = getCompilerOptions(tsconfigpath)

    return void onEnd((result: BuildResult): void => {
      result.outputFiles = result.outputFiles!.map((output: OutputFile) => {
        /**
         * Output file extension.
         *
         * @const {string} output_ext
         */
        const output_ext: string = pathe.extname(output.path)

        // skip output files that are not javascript or typescript
        if (!EXT_JS_REGEX.test(output_ext) && !EXT_TS_REGEX.test(output_ext)) {
          return output
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

        // because this plugin doesn't handle bundles, the entry point can be
        // reset to the first (and only!) key in metadata.inputs
        if (!metadata.entryPoint) {
          metadata.entryPoint = Object.keys(metadata.inputs)[0]!
        }

        /**
         * Absolute path to source file.
         *
         * @const {string} parent
         */
        const parent: string = pathe.resolve(absWorkingDir, metadata.entryPoint)

        /**
         * {@link output.text} with path aliases replaced.
         *
         * @const {string} text
         */
        const text: string = resolveAliases(output.text, {
          baseUrl,
          extensions,
          fileExists,
          mainFields,
          parent,
          paths,
          readFile
        })

        return { ...output, contents: new Uint8Array(Buffer.from(text)), text }
      })
    })
  }

  return { name: 'tsconfig-paths', setup }
}

export { plugin as default, type Options }
