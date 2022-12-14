/**
 * @file Fixtures - build.config.ts
 * @module fixtures/configs/build.config.ts
 */

import { defineBuildConfig } from '#src'

export default defineBuildConfig({
  absWorkingDir: '__fixtures__/configs/ts',
  entries: [{ format: 'esm' }, { ext: '.cjs', format: 'cjs' }]
})
