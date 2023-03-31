/**
 * @file Mocks - exitHook
 * @module mocks/exitHook
 * @see https://github.com/sindresorhus/exit-hook
 */

/**
 * [`exit-hook`][1] module type.
 *
 * [1]: https://github.com/sindresorhus/exit-hook
 */
type Actual = typeof import('exit-hook')

/**
 * `exit-hook` module.
 *
 * @const {Actual} actual
 */
const actual: Actual = await vi.importActual<Actual>('exit-hook')

export const asyncExitHook = vi.fn(actual.asyncExitHook)

export default vi.fn(actual.default)
