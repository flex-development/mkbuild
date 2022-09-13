/**
 * @file Fixtures - build.config.ts
 * @module fixtures/configs/build.config.ts
 */

import { defineBuildConfig } from '#src'

export default defineBuildConfig({ entries: [{ format: 'esm' }] })
