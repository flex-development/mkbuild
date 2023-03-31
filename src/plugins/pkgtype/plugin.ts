/**
 * @file Plugins - pkgtype
 * @module mkbuild/plugins/pkgtype/plugin
 */

import type { PackageJson } from '@flex-development/pkg-types'
import togglePkgType from '@flex-development/toggle-pkg-type'
import type { BuildOptions, Plugin, PluginBuild } from 'esbuild'

/**
 * Returns a plugin to toggle the [`type`][1] field in the given `pkg`.
 *
 * [1]: https://nodejs.org/api/packages.html#type
 *
 * @see https://github.com/evanw/esbuild/issues/2026
 * @see https://github.com/flex-development/toggle-pkg-type
 *
 * @param {PackageJson} pkg - `package.json` object
 * @return {Plugin} Package [`type`][1] toggle plugin
 */
const plugin = (pkg: PackageJson): Plugin => {
  /**
   * Toggles the [`type`][1] field in a `package.json` object.
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
    const { absWorkingDir = process.cwd(), format } = initialOptions

    // enable type field toggling
    if (pkg.type === 'module' && format === 'cjs') {
      onStart(() => togglePkgType(null, absWorkingDir))
      onEnd(() => togglePkgType(null, absWorkingDir))
    }

    return void 0
  }

  return { name: 'pkgtype', setup }
}

export default plugin
