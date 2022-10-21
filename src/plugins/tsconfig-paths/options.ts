/**
 * @file Plugin Options - tsconfig-paths
 * @module mkbuild/plugins/tsconfig-paths/options
 */

import type { ResolveAliasOptions as OptionsBase } from '@flex-development/mlly'

/**
 * [`tsconfig-paths`][1] plugin options.
 *
 * [1]: https://github.com/dividab/tsconfig-paths
 *
 * @extends {Omit<OptionsBase, 'baseUrl' | 'parent' | 'paths' | 'tsconfig'>}
 */
interface TsconfigPathsPluginOptions
  extends Omit<OptionsBase, 'baseUrl' | 'parent' | 'paths' | 'tsconfig'> {}

export type { TsconfigPathsPluginOptions as default }
