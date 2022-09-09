/**
 * @file Mocks - mlly
 * @module mocks/mlly
 * @see https://github.com/unjs/mlly
 */

/**
 * [`mlly`][1] module type.
 *
 * [1]: https://github.com/unjs/mlly
 */
type Actual = typeof import('mlly')

/**
 * `mlly` module.
 *
 * @const {Actual} actual
 */
const actual: Actual = await vi.importActual<Actual>('mlly')

export const findDynamicImports = vi.fn(actual.findDynamicImports)
export const findExports = vi.fn(actual.findExports)
export const findStaticImports = vi.fn(actual.findStaticImports)
export const resolvePath = vi.fn(actual.resolvePath)
