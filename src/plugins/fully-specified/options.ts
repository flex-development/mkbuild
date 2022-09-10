/**
 * @file Plugin Options - fully-specified
 * @module mkbuild/plugins/fully-specified/options
 */

/**
 * `fully-specified` plugin options.
 */
interface FullySpecifiedPluginOptions {
  /**
   * Module extensions to probe for.
   *
   * @default MODULE_EXTENSIONS
   */
  extensions?: string[]
}

export type { FullySpecifiedPluginOptions as default }
