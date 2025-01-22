/**
 * @file Type Aliases - SourcemapIgnoreTest
 * @module mkbuild/types/SourcemapIgnoreTest
 */

/**
 * Decide whether or not to ignore-list a source file in a sourcemap.
 *
 * @this {void}
 *
 * @param {string} source
 *  Relative path from generated `.map` file to corresponding source file
 * @param {string} map
 *  Fully resolved path of generated sourcemap file
 * @return {boolean}
 *  `true` if source file should be added to ignore list, `false` otherwise
 */
type SourcemapIgnoreTest = (
  this: void,
  source: string,
  map: string
) => boolean

export type { SourcemapIgnoreTest as default }
