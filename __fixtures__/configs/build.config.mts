/**
 * @file Fixtures - build.config.mts
 * @module fixtures/configs/build.config.mts
 */

import { defineBuildConfig } from '#src'

export default defineBuildConfig({ entries: [{ format: 'esm' }] })
