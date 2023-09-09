/**
 * @file Type Definitions - Trailer
 * @module grease/types/Trailer
 */

/**
 * Object representing a trailer line in a commit message.
 *
 * @see https://git-scm.com/docs/git-interpret-trailers
 */
type Trailer = {
  /**
   * Trailer token.
   */
  token: string

  /**
   * Trailer value.
   */
  value: string
}

export type { Trailer as default }
