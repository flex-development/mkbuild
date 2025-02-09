/**
 * @file Type Aliases - ExportMode
 * @module mkbuild/types/ExportMode
 */

/**
 * Union of export modes.
 *
 * @see https://rollupjs.org/configuration-options/#output-exports
 */
type ExportMode = 'auto' | 'default' | 'named' | 'none'

export type { ExportMode as default }
