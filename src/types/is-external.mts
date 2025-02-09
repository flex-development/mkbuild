/**
 * @file Type Aliases - IsExternal
 * @module mkbuild/types/IsExternal
 */

/**
 * Determine if `id` should marked as external.
 *
 * If a relative import, i.e. a specifier starting with `./` or `../`, is marked
 * as "external", mkbuild (rollup) will internally resolve the id to an absolute
 * file system location so that different imports of the external module can be
 * merged. When the resulting bundle is written, the import will again be
 * converted to a relative import.
 *
 * The conversion back to a relative import is done as if `task.outdir` were in
 * the same location as the entry point or the common base directory of all
 * entry points if there is more than one.
 *
 * @this {void}
 *
 * @param {string} id
 *  Module id
 * @param {string | undefined} importer
 *  Id of importing (parent) module
 * @param {boolean} resolved
 *  Whether `id` has been resolved (e.g. by plugins)
 * @return {boolean | null | void | undefined}
 *  `true` if `id` should be marked as external
 */
type IsExternal = (
  this: void,
  id: string,
  importer: string | undefined,
  resolved: boolean
) => boolean | null | void | undefined

export type { IsExternal as default }
