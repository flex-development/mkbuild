/**
 * @file Mock Utilities - analyzeOutputs
 * @module mkbuild/utils/mocks/analyzeOutputs
 */

/**
 * `analyzeOutputs` module type.
 */
type Actual = typeof import('../analyze-outputs')

/**
 * `analyzeOutputs` module.
 *
 * @const {Actual} actual
 */
const actual: Actual = await vi.importActual<Actual>('../analyze-outputs')

export default vi.fn(actual.default)
