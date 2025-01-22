/**
 * @file Interfaces - ResolvedConfig
 * @module mkbuild/interfaces/ResolvedConfig
 */

import type { Config } from '@flex-development/mkbuild'

/**
 * Resolved build configuration.
 */
interface ResolvedConfig {
  /**
   * Build configuration.
   *
   * @see {@linkcode Config}
   */
  config: Config

  /**
   * URL of config file.
   */
  url: URL | null
}

export type { ResolvedConfig as default }
