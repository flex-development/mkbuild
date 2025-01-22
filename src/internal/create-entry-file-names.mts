/**
 * @file Internal - createEntryFileNames
 * @module mkbuild/internal/createEntryFileNames
 */

import type { EntryFileNamesFn, Task } from '@flex-development/mkbuild'
import { isNIL, template } from '@flex-development/tutils'
import { ok } from 'devlop'
import type { PreRenderedChunk } from 'rollup'

/**
 * Create a function that returns a pattern to use for naming chunks created
 * from entry points.
 *
 * @see {@linkcode EntryFileNamesFn}
 * @see {@linkcode Task}
 *
 * @internal
 *
 * @this {void}
 *
 * @param {Pick<Task, 'entryFileNames' | 'ext'>} task
 *  Build task
 * @return {EntryFileNamesFn}
 *  Entry point chunk file name generator
 */
function createEntryFileNames(
  this: void,
  task: Pick<Task, 'entryFileNames' | 'ext'>
): EntryFileNamesFn {
  return entryFileNames

  /**
   * @this {void}
   *
   * @param {PreRenderedChunk} chunk
   *  Pre-rendered entry chunk
   * @return {string}
   *  Pattern to use for naming `chunk`
   */
  function entryFileNames(this: void, chunk: PreRenderedChunk): string {
    ok(task, 'expected `task`')
    ok(!isNIL(task.entryFileNames), 'expected `task.entryFileNames`')
    ok(!isNIL(task.ext), 'expected `task.ext`')

    /**
     * Pattern to use for naming chunks created from entry points.
     *
     * @const {string} entryFileNames
     */
    const entryFileNames: string = typeof task.entryFileNames === 'string'
      ? task.entryFileNames
      : task.entryFileNames(chunk)

    return template(entryFileNames, { extname: task.ext })
  }
}

export default createEntryFileNames
