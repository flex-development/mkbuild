/**
 * @file Mock Utilities - analyzeResults
 * @module mkbuild/utils/mocks/analyzeResults
 */

/**
 * `analyzeResults` module type.
 */
type Actual = typeof import('../analyze-results')

/**
 * `analyzeResults` module.
 *
 * @const {Actual} actual
 */
const actual: Actual = await vi.importActual<Actual>('../analyze-results')

export default vi.fn(actual.default)
