/**
 * @file Type Definitions - Author
 * @module grease/types/Author
 */

/**
 * A commit author.
 */
type Author = {
  /**
   * Commit author email.
   */
  email: string

  /**
   * Commit author name.
   */
  name: string
}

export type { Author as default }
