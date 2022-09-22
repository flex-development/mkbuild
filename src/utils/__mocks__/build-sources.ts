/**
 * @file Mock Utilities - buildSources
 * @module mkbuild/utils/mocks/buildSources
 */

/**
 * `buildSources` module type.
 */
type Actual = typeof import('../build-sources')

/**
 * `buildSources` module.
 *
 * @const {Actual} actual
 */
const actual: Actual = await vi.importActual<Actual>('../build-sources')

export default vi.fn(actual.default)
