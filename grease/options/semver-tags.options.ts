/**
 * @file Options - SemverTagOptions
 * @module grease/options/SemverTagOptions
 */

/**
 * Semver tag retrieval options.
 */
type SemverTagOptions = {
  /**
   * Tag prefix to consider when validating tags.
   *
   * @default ''
   */
  tagprefix?: string

  /**
   * Include unstable releases.
   *
   * @default true
   */
  unstable?: boolean
}

export type { SemverTagOptions as default }
