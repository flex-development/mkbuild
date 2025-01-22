/**
 * @file Type Aliases - SourcemapPathTransform
 * @module mkbuild/types/SourcemapPathTransform
 */

/**
 * Apply a transformation to a path in a sourcemap.
 *
 * @this {void}
 *
 * @param {string} source
 *  Relative path from generated `.map` file to corresponding source file
 * @param {string} map
 *  Fully resolved path of generated sourcemap file
 * @return {string}
 *  New sourcemap path
 */
type SourcemapPathTransform = (
  this: void,
  source: string,
  map: string
) => string

export type { SourcemapPathTransform as default }
