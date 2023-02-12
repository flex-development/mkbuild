/**
 * @file Mocks - @flex-development/pathe
 * @module mocks/flex-development/pathe
 * @see https://github.com/flex-development/pathe
 */

/**
 * [`@flex-development/pathe`][1] module type.
 *
 * [1]: https://github.com/flex-development/pathe
 */
type Actual = typeof import('@flex-development/pathe')

/**
 * `@flex-development/pathe` module.
 *
 * @const {Actual} actual
 */
const actual: Actual = await vi.importActual<Actual>('@flex-development/pathe')

export const basename = vi.fn(actual.basename)
export const dirname = vi.fn(actual.dirname)
export const extname = vi.fn(actual.extname)
export const format = vi.fn(actual.format)
export const join = vi.fn(actual.join)
export const parse = vi.fn(actual.parse)
export const relative = vi.fn(actual.relative)
export const resolve = vi.fn(actual.resolve)

export default {
  basename,
  dirname,
  extname,
  format,
  join,
  parse,
  relative,
  resolve
}
