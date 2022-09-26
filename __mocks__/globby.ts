/**
 * @file Mocks - globby
 * @module mocks/globby
 * @see https://github.com/sindresorhus/globby
 */

/**
 * [`globby`][1] module type.
 *
 * [1]: https://github.com/sindresorhus/globby
 */
type Actual = typeof import('globby')

/**
 * `globby` module.
 *
 * @const {Actual} actual
 */
const actual: Actual = await vi.importActual<Actual>('globby')

export const globby = vi.fn(actual.globby)
