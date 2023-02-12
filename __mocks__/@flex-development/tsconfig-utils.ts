/**
 * @file Mocks - @flex-development/tsconfig-utils
 * @module mocks/flex-development/tsconfig-utils
 * @see https://github.com/flex-development/tsconfig-utils
 */

/**
 * [`@flex-development/tsconfig-utils`][1] module type.
 *
 * [1]: https://github.com/flex-development/tsconfig-utils
 */
type Actual = typeof import('@flex-development/tsconfig-utils')

/**
 * `@flex-development/tsconfig-utils` module.
 *
 * @const {Actual} actual
 */
const actual: Actual = await vi.importActual<Actual>(
  '@flex-development/tsconfig-utils'
)

export const ScriptTarget = actual.ScriptTarget
export const normalizeCompilerOptions = vi.fn(actual.normalizeCompilerOptions)
export const normalizeModuleResolution = vi.fn(actual.normalizeModuleResolution)
export const resolvePaths = vi.fn(actual.resolvePaths)
