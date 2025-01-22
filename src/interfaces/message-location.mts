/**
 * @file Interfaces - MessageLocation
 * @module mkbuild/interfaces/MessageLocation
 */

import type { Point } from '@flex-development/vfile-location'

/**
 * Build message location.
 *
 * @see {@linkcode Point}
 *
 * @extends {Omit<Point,'offset'>}
 */
interface MessageLocation extends Omit<Point, 'offset'> {
  /**
   * Module id of file where message occurred.
   */
  file?: string | undefined
}

export type { MessageLocation as default }
