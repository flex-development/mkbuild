/**
 * @file Mock Utilities - write
 * @module mkbuild/utils/mocks/write
 */

vi.mock('fs-extra')

/**
 * `write` module type.
 */
type Actual = typeof import('../write')

/**
 * `write` module.
 *
 * @const {Actual} actual
 */
const actual: Actual = await vi.importActual<Actual>('../write')

export default vi.fn(actual.default)
