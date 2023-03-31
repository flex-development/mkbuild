/**
 * @file Interfaces - Task
 * @module mkbuild/interfaces/Task
 */

import type { EsbuildOptions } from '#src/types'
import type Options from './options'

/**
 * Object representing a build task.
 *
 * @extends {EsbuildOptions}
 * @extends {Options}
 */
interface Task extends EsbuildOptions, Options {
  /**
   * Current working directory.
   */
  cwd: string

  /**
   * Relative path to output directory.
   *
   * Does **not** include `'./'` prefix.
   */
  outdir: string

  /**
   * Name of directory containing source files or relative path to bundle input.
   */
  source: string
}

export type { Task as default }
