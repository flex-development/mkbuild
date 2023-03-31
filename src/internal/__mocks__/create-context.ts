/**
 * @file Mock Internals - createContext
 * @module mkbuild/internal/mocks/createContext
 */

/**
 * `createContext` module type.
 */
type Actual = typeof import('../create-context')

/**
 * `createContext` module.
 *
 * @const {Actual} actual
 */
const actual: Actual = await vi.importActual<Actual>('../create-context')

export default vi.fn(actual.default)
