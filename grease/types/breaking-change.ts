/**
 * @file Type Definitions - BreakingChange
 * @module grease/types/BreakingChange
 */

import type { Nullable } from '@flex-development/tutils'

/**
 * Object representing a breaking change noted in a commit subject or trailer.
 */
type BreakingChange = {
  /**
   * Commit scope if breaking change was noted in a scoped commit message.
   */
  scope: Nullable<string>

  /**
   * Commit subject or breaking change trailer value.
   */
  subject: string

  /**
   * Commit type.
   */
  type: string
}

export type { BreakingChange as default }
