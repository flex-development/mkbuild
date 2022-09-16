/**
 * @file Build Config
 * @module config/build
 */

import { defineBuildConfig, type Config } from '#src'

/**
 * Build configuration options.
 *
 * @const {Config} config
 */
const config: Config = defineBuildConfig({
  entries: [{ format: 'esm' }],
  esbuild: { treeShaking: true, tsconfig: 'tsconfig.build.json' }
})

export default config
