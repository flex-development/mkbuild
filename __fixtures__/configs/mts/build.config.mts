/**
 * @file Fixtures - build.config.mts
 * @module fixtures/configs/mts/build.config.mts
 */

import { defineBuildConfig } from '#src'

export default defineBuildConfig({
  absWorkingDir: '__fixtures__/configs/mts',
  entries: [{ format: 'esm' }]
})
