/**
 * @file Mocks - @flex-development/mlly
 * @module mocks/flex-development/mlly
 * @see https://github.com/flex-development/mlly
 */

/**
 * [`@flex-development/mlly`][1] module type.
 *
 * [1]: https://github.com/flex-development/mlly
 */
type Actual = typeof import('@flex-development/mlly')

/**
 * `@flex-development/mlly` module.
 *
 * @const {Actual} actual
 */
const actual: Actual = await vi.importActual<Actual>('@flex-development/mlly')

export const RESOLVE_EXTENSIONS = actual.RESOLVE_EXTENSIONS
export const resolveAliases = vi.fn(actual.resolveAliases)
export const resolveModules = vi.fn(actual.resolveModules)
export const toDataURL = vi.fn(actual.toDataURL)
