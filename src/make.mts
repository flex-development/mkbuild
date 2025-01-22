/**
 * @file make
 * @module mkbuild/make
 */

import readPackageJson from '#internal/read-package-json'
import clean from '#plugins/clean'
import mergeTask from '#utils/merge-task'
import runnableTask from '#utils/runnable-task'
import type { Config, Report, RunnableTask } from '@flex-development/mkbuild'

/**
 * Execute build tasks.
 *
 * @see {@linkcode Config}
 * @see {@linkcode Report}
 *
 * @async
 *
 * @this {void}
 *
 * @param {Config | null | undefined} [config]
 *  Build configuration
 * @return {Promise<Report>}
 *  Build report
 */
async function make(
  this: void,
  config?: Config | null | undefined
): Promise<Report> {
  /**
   * Build report.
   *
   * @const {Report} report
   */
  const report: Report = Object.defineProperties({ builds: [], size: 0 }, {
    size: {
      enumerable: true,
      /**
       * Get the size of `this` build report.
       *
       * @this {Report}
       *
       * @return {number}
       *  Build report size in bytes
       */
      get(this: Report): number {
        return this.builds.reduce((acc, result) => acc + result.size, 0)
      }
    }
  })

  if (config) {
    const { fs, tasks, ...baseTask } = config

    // execute build tasks
    for (const tsk of tasks ?? [baseTask]) {
      /**
       * Runnable build task.
       *
       * @const {RunnableTask} task
       */
      const task: RunnableTask = runnableTask(mergeTask({}, baseTask, tsk), fs)

      // run build task + add result to build report
      report.builds.push(await task.run())
    }

    // clear caches
    clean.directories.clear()
    readPackageJson.cache.clear()
  }

  return report
}

export default make
