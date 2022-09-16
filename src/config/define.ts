/**
 * @file Config - defineBuildConfig
 * @module mkbuild/config/defineBuildConfig
 */

import type { Config } from '#src/interfaces'

/**
 * Helper for defining a build configuration object.
 *
 * @param {Config} [config={}] - Build configuration options
 * @return {Config} `config`
 */
const defineBuildConfig = (config: Config = {}): Config => config

export default defineBuildConfig
