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
  entries: [
    { declaration: true, ignore: ['cli.ts'] },
    { bundle: true, minify: true, source: 'src/cli.ts' }
  ],
  esbuild: {
    platform: 'node',
    sourcemap: 'external',
    sourcesContent: false,
    target: ['es2021', 'node14'],
    treeShaking: true,
    tsconfig: 'tsconfig.build.json'
  }
})

export default config
