/**
 * @file Mocks - esbuild
 * @module mocks/esbuild
 * @see https://esbuild.github.io
 */

/**
 * [`esbuild`][1] module type.
 *
 * [1]: https://esbuild.github.io
 */
type Actual = typeof import('esbuild')

/**
 * `esbuild` module.
 *
 * @const {Actual} actual
 */
const actual: Actual = await vi.importActual<Actual>('esbuild')

export const context = vi.fn(actual.context)
export const transform = vi.fn(actual.transform)
