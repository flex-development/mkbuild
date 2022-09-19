/**
 * @file Plugins - fully-specified
 * @module mkbuild/plugins/fully-specified
 */

import {
  BUILTIN_MODULES,
  EXT_JS_REGEX,
  EXT_TS_REGEX,
  RESOLVE_EXTENSIONS
} from '#src/config/constants'
import type { OutputMetadata } from '#src/types'
import extractStatements from '#src/utils/extract-statements'
import type {
  BuildOptions,
  BuildResult,
  OutputFile,
  Plugin,
  PluginBuild
} from 'esbuild'
import { resolvePath } from 'mlly'
import * as pathe from 'pathe'
import {
  readPackageJSON,
  resolvePackageJSON,
  type PackageJson
} from 'pkg-types'

/**
 * Plugin name.
 *
 * @const {string} PLUGIN_NAME
 */
const PLUGIN_NAME: string = 'fully-specified'

/**
 * Returns a specifier resolver plugin. There are three types of specifiers:
 *
 * > - *Relative specifiers* like `'./startup.js'` or `'../config.mjs'`. They
 * >   refer to a path relative to the location of the importing file. The file
 * >   extension is always necessary for these.
 * > - *Bare specifiers* like `'some-package'` or `'some-package/shuffle'`. They
 * >   can refer to the main entry point of a package by the package name, or a
 * >   specific feature module within a package prefixed by the package name as
 * >   per the examples respectively. Including the file extension is only
 * >   necessary for packages without an ["exports"][1] field.
 * > - *Absolute specifiers* like `'file:///opt/nodejs/config.js'`. They refer
 * >   directly and explicitly to a full path.
 *
 * The resolver adds file extensions to **bare** and **relative** specifiers in
 * output content.
 *
 * **Note**: [`--experimental-specifier-resolution=node`][2] can be used to
 * customize the ESM specifier resolution algorithm so that file extensions are
 * not required.
 *
 * [1]: https://nodejs.org/docs/latest-v16.x/api/packages.html#exports
 * [2]: https://nodejs.org/docs/latest-v16.x/api/esm.html#customizing-esm-specifier-resolution-algorithm
 *
 * @see https://nodejs.org/docs/latest-v16.x/api/esm.html#terminology
 *
 * @return {Plugin} Specifier resolver plugin
 */
const plugin = (): Plugin => {
  /**
   * Adds file extensions to relative specifiers in output file content.
   *
   * [1]: https://esbuild.github.io/plugins
   * [2]: https://esbuild.github.io/api/#build-api
   *
   * @param {PluginBuild} build - [esbuild plugin api][1]
   * @param {BuildOptions} build.initialOptions - [esbuild build api][2] options
   * @param {PluginBuild['onEnd']} build.onEnd - Build end callback
   * @param {PluginBuild['onStart']} build.onStart - Build start callback
   * @return {void} Nothing when complete
   */
  const setup = ({ initialOptions, onEnd, onStart }: PluginBuild): void => {
    const {
      absWorkingDir = process.cwd(),
      bundle,
      format = 'esm',
      metafile,
      outExtension: { '.js': ext = '.js' } = {},
      resolveExtensions: extensions = RESOLVE_EXTENSIONS
    } = initialOptions

    // bundle output shouldn't contain relative specifiers
    if (bundle) return

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

    return void onEnd(async (result: BuildResult): Promise<void> => {
      /**
       * Output file objects.
       *
       * @const {OutputFile[]} outputFiles
       */
      const outputFiles: OutputFile[] = []

      for (const output of result.outputFiles!) {
        /**
         * Output file extension.
         *
         * @const {string} output_ext
         */
        const output_ext: string = pathe.extname(output.path)

        // do nothing if output file isn't javascript or typescript
        if (!EXT_JS_REGEX.test(output_ext) && !EXT_TS_REGEX.test(output_ext)) {
          outputFiles.push(output)
          continue
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
         * @const {string} source
         */
        const source: string = pathe.resolve(absWorkingDir, metadata.entryPoint)

        /**
         * {@link output.text} copy.
         *
         * @var {string} text
         */
        let text: string = output.text

        // replace specifiers
        for (const statement of extractStatements(output.text)) {
          /**
           * {@link statement.specifier} before file extension is added.
           *
           * @var {string | undefined} specifier
           */
          let specifier: string | undefined = statement.specifier

          // do nothing if missing module specifier
          if (!specifier) continue

          // do nothing if specifier references built-in module
          if (BUILTIN_MODULES.includes(specifier)) continue

          // do nothing if specifier is absolute
          if (/^(\/|(data|file|https?):)/.test(specifier)) continue

          // do nothing if specifier already includes file extension
          if (pathe.extname(specifier)) continue

          /**
           * {@link specifier} resolved.
           *
           * @see https://github.com/unjs/mlly#resolvepath
           *
           * @const {string} resolved
           */
          const resolved: string = await resolvePath(specifier, {
            conditions: [format === 'esm' ? 'import' : 'require'],
            extensions,
            url: specifier.startsWith('.') ? source : pathe.dirname(source)
          })

          // add extension to bare or relative specifier
          // bare specifier => resolved contains '/node_modules/'
          // relative specifier => resolved does not contain '/node_modules/'
          if (/\/node_modules\//.test(resolved)) {
            /**
             * Path to `package.json` of package {@link resolved} references.
             *
             * @const {string} pkgfile
             */
            const pkgfile: string = await resolvePackageJSON(resolved, {
              startingFrom: pathe.dirname(resolved)
            })

            /**
             * `package.json` of package {@link resolved} references.
             *
             * @const {PackageJson} pkg
             */
            const pkg: PackageJson = await readPackageJSON(pkgfile)

            /**
             * {@link pkg} entry point resolved.
             *
             * @const {string} main
             */
            const main: string = pathe.resolve(
              absWorkingDir,
              'node_modules',
              pkg.name!,
              pkg.main!
            )

            // update specifier if pkg does not have exports field
            // and resolved is not pkg entry point
            if (pkg.exports === undefined && resolved !== main) {
              specifier = resolved.replace(/.+(node_modules\/)/, '')
            }
          } else {
            // get basename of specifier and resolved
            const { name } = pathe.parse(specifier)
            const { name: resolved_name } = pathe.parse(resolved)

            // specifier resolved to a directory
            if (name !== resolved_name) specifier += '/' + resolved_name

            // add output file extension to specifier
            specifier += ext
          }

          // replace specifier
          text = text.replace(
            statement.code,
            statement.code.replace(statement.specifier!, specifier)
          )
        }

        outputFiles.push({
          ...output,
          contents: new Uint8Array(Buffer.from(text)),
          text
        })
      }

      return void (result.outputFiles = outputFiles)
    })
  }

  return { name: PLUGIN_NAME, setup }
}

export default plugin
