/**
 * @file Type Aliases - SourcemapOption
 * @module mkbuild/types/SourcemapOption
 */

/**
 * Union of generate production source maps.
 *
 * - `true`: separate sourcemap files will be created
 * - `'hidden'`: works like `true`, but sourcemap comments in corresponding
 *   output files are suppressed
 * - `'inline'`: sourcemaps will be appended to output files as data URIs
 */
type SourcemapOption = 'hidden' | 'inline' | boolean

export type { SourcemapOption as default }
