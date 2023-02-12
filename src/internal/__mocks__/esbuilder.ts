/**
 * @file Mock Internals - esbuilder
 * @module mkbuild/internal/mocks/esbuilder
 */

/**
 * `esbuilder` module type.
 */
type Actual = typeof import('../esbuilder')

/**
 * `esbuilder` module.
 *
 * @const {Actual} actual
 */
const actual: Actual = await vi.importActual<Actual>('../esbuilder')

export default vi.fn(actual.default)
