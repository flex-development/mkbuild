/**
 * @file Interfaces - RunnableTask
 * @module mkbuild/interfaces/RunnableTask
 */

import type { Format, Result, Task } from '@flex-development/mkbuild'

/**
 * A build task with a `run` method.
 *
 * @see {@linkcode Task}
 *
 * @extends {Task}
 */
interface RunnableTask extends Task {
  /**
   * Output file format.
   *
   * @see {@linkcode Format}
   *
   * @override
   *
   * @default
   *  pkg.type === 'module' ? 'esm' : 'cjs'
   */
  format: Format

  /**
   * Absolute path to project root directory.
   *
   * @override
   *
   * @default
   *  pathe.cwd() + pathe.sep
   */
  root: string

  /**
   * Task runner.
   *
   * @see {@linkcode Result}
   *
   * @async
   *
   * @this {void}
   *
   * @return {Promise<Result>}
   *  Build result
   */
  run(this: void): Promise<Result>
}

export type { RunnableTask as default }
