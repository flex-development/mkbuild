/**
 * @file Mock Config - loadBuildConfig
 * @module mkbuild/config/mocks/loadBuildConfig
 */

/**
 * `loadBuildConfig` module type.
 */
type Actual = typeof import('../load')

/**
 * `loadBuildConfig` module.
 *
 * @const {Actual} actual
 */
const actual: Actual = await vi.importActual<Actual>('../load')

export default vi.fn(actual.default)
