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
   * @default RESOLVE_EXTENSIONS
   */
  extensions?: string[]
}

export type { FullySpecifiedPluginOptions as default }
