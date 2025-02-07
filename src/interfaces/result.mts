/**
 * @file Interfaces - Result
 * @module mkbuild/interfaces/Result
 */

import type { Logger } from '@flex-development/log'
import type {
  Failure,
  Format,
  Message,
  OutputAsset,
  OutputChunk,
  RunnableTask
} from '@flex-development/mkbuild'
import type { PackageJson } from '@flex-development/pkg-types'
import type { SerializedTimings } from 'rollup'

/**
 * Build task result.
 *
 * @todo `bundle`
 */
interface Result {
  /**
   * Build failure.
   *
   * @see {@linkcode Failure}
   */
  failure?: Failure | null | undefined

  /**
   * Output file format.
   *
   * @see {@linkcode Format}
   */
  format: Format

  /**
   * Task logger.
   *
   * @see {@linkcode Logger}
   */
  logger: Logger

  /**
   * Build messages.
   *
   * @see {@linkcode Message}
   */
  messages: Message[]

  /**
   * Output directory.
   *
   * > 👉 **Note**: Relative to {@linkcode root}.
   */
  outdir: string

  /**
   * Output files.
   *
   * @see {@linkcode OutputAsset}
   * @see {@linkcode OutputChunk}
   */
  outputs: (OutputAsset | OutputChunk)[]

  /**
   * Package manifest.
   *
   * @see {@linkcode PackageJson}
   */
  pkg: PackageJson

  /**
   * Absolute path to working directory.
   */
  root: string

  /**
   * Get the size of the build result.
   *
   * @return {number}
   *  Build result size in bytes
   */
  get size(): number

  /**
   * Build task.
   *
   * @see {@linkcode RunnableTask}
   */
  task: Omit<RunnableTask, 'run'>

  /**
   * Serialized performance timings.
   *
   * For each key, the first number represents the elapsed time, the second the
   * change in memory consumption, and the third represents the total memory
   * consumption after this step.
   * The order of these steps is the order used by `Object.keys`.
   * Top level keys start with `#` and contain the timings of nested steps, i.e.
   * in the example below, the `698ms` of the `# BUILD` step include the `538ms`
   * of the `## parse modules` step.
   *
   * @example
   *  {
   *    "# BUILD": [ 698.020877, 33979632, 45328080 ],
   *    "## parse modules": [ 537.509342, 16295024, 27660296 ],
   *    "load modules": [ 33.253778999999994, 2277104, 38204152 ]
   *  }
   *
   * @see {@linkcode SerializedTimings}
   */
  timings?: SerializedTimings | null | undefined
}

export type { Result as default }
