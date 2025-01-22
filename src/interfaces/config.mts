/**
 * @file Interfaces - Config
 * @module mkbuild/interfaces/Config
 */

import type { FileSystem, Task } from '@flex-development/mkbuild'

/**
 * Build configuration.
 *
 * @see {@linkcode Task}
 *
 * @extends {Task}
 */
interface Config extends Task {
  /**
   * File system API.
   *
   * @see {@linkcode FileSystem}
   */
  fs?: Partial<FileSystem> | null | undefined

  /**
   * Build tasks.
   *
   * Each build task will be merged with the base task. Top-level lists (arrays
   * and sets) are concatted and deduped. Plain objects are deep merged.
   *
   * > 👉 **Note**: If empty, `null`, or `undefined`, a single build task will
   * > be inferred from the base task.
   *
   * @see {@linkcode Task}
   */
  tasks?: Task[] | null | undefined
}

export type { Config as default }
