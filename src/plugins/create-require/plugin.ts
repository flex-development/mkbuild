/**
 * @file Plugins - create-require
 * @module mkbuild/plugins/create-require/plugin
 */

import { constant, define, join, regexp } from '@flex-development/tutils'
import {
  transform,
  type BuildOptions,
  type BuildResult,
  type OutputFile,
  type Plugin,
  type PluginBuild
} from 'esbuild'
import util from 'node:util'

/**
 * Plugin-specific build options.
 *
 * @internal
 */
type SpecificOptions = { metafile: true; write: false }

/**
 * Returns a plugin that defines the `require` function in ESM bundles.
 *
 * When outputting ESM, any `require` calls will be replaced with esbuild's
 * `__require` shim, since [`require` is not defined in ESM environments][1].
 *
 * The shim first checks if `require` is polyfilled. If it is, the shim passes
 * the call to `require.apply`. If `require` isn't defined, an error will be
 * thrown: `Dynamic require of "' + x + '" is not supported`.
 *
 * This is particularly problematic when bundling, especially when targeting
 * node ([`platform === 'node'`][2]), since [built-in modules][3] are marked
 * as [`external`][4] by esbuild automatically. `require`ing these modules, as
 * well as other externals, will generate a runtime error. This is described
 * in [`evanw/esbuild#1921`][5].
 *
 * To circumvent this issue, output files containing the shim will have a
 * snippet insert that defines `require` using [`module.createRequire`][6].
 *
 * [1]: https://nodejs.org/api/esm.html#no-require-exports-or-moduleexports
 * [2]: https://esbuild.github.io/api/#platform
 * [3]: https://nodejs.org/api/esm.html#builtin-modules
 * [4]: https://esbuild.github.io/api/#external
 * [5]: https://github.com/evanw/esbuild/issues/1921
 * [6]: https://nodejs.org/api/module.html#modulecreaterequirefilename
 *
 * @return {Plugin} `create-require` plugin
 */
const plugin = (): Plugin => {
  /**
   * Inserts a `require` function definition into ESM bundles.
   *
   * [1]: https://esbuild.github.io/plugins
   * [2]: https://esbuild.github.io/api/#build-api
   *
   * @param {PluginBuild} build - [esbuild plugin api][1]
   * @param {BuildOptions} build.initialOptions - [esbuild build api][2] options
   * @param {PluginBuild['onEnd']} build.onEnd - Build end callback
   * @return {Promise<void>} Nothing when complete
   */
  const setup = async ({
    initialOptions,
    onEnd
  }: PluginBuild): Promise<void> => {
    const {
      absWorkingDir = process.cwd(),
      banner: { js: banner = '' } = {},
      bundle,
      format = 'esm',
      metafile,
      minify = false,
      minifySyntax,
      minifyWhitespace,
      platform = 'node',
      target = [],
      write
    } = initialOptions

    // do nothing if bundling is not enabled
    if (!bundle) return void bundle

    // do nothing if not creating esm bundle
    if (format !== 'esm') return void format

    // esbuild write must be disabled to access result.outputFiles
    if (write) throw new Error('write must be disabled')

    // metafile required to get output metadata
    if (!metafile) throw new Error('metafile required')

    /**
     * Code snippet that defines `require` using [`module.createRequire`][1].
     *
     * [1]: https://nodejs.org/api/module.html#modulecreaterequirefilename
     *
     * @const {string} snippet
     */
    const snippet: string = join(
      [
        'import { createRequire as __createRequire } from \'node:module\'',
        'const require = __createRequire(import.meta.url)'
      ],
      '\n'
    )

    // transform snippet to re-add banner and minify
    let { code } = await transform(snippet, {
      banner,
      minifySyntax: minifySyntax ?? minify,
      minifyWhitespace: minifyWhitespace ?? minify,
      platform,
      target
    })

    // remove new line from end of code snippet if output should be minified
    if (minify || minifyWhitespace) code = code.replace(/\n$/, '')

    return void onEnd((result: BuildResult<SpecificOptions>): void => {
      /**
       * Regex used to deduce if an output file includes the `__require` shim.
       *
       * @const {RegExp} filter
       */
      const filter: RegExp = /Dynamic require of ".*" is not supported/m

      // insert require function definitions
      result.outputFiles = result.outputFiles.map((output: OutputFile) => {
        // do nothing if output file does not contain shim
        if (!filter.test(output.text)) return output

        // get hashbang
        const [hashbang = ''] = /^#!.+\n/.exec(output.text) ?? []

        /**
         * {@linkcode output.text} copy.
         *
         * @var {string} text
         */
        let text: string = output.text.replace(hashbang, '')

        // remove banner
        if (banner) text = text.replace(new RegExp(regexp(banner) + '\n?'), '')

        // redefine output text to insert require function definition
        define(output, 'text', { get: constant(hashbang + code + text) })

        // reset output file contents
        output.contents = new util.TextEncoder().encode(output.text)

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
         * Output contents size including `require` function definition.
         *
         * @const {number} bytes
         */
        const bytes: number = Buffer.byteLength(output.contents)

        // reset output file size
        result.metafile.outputs[outfile]!.bytes = bytes

        return output
      })
    })
  }

  return { name: 'create-require', setup }
}

export { plugin as default }
