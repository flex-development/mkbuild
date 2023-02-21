/**
 * @file Configuration - Build
 * @module config/build
 */

import { defineBuildConfig, type Config } from '#src'
import pkg from './package.json' assert { type: 'json' }

/**
 * Build configuration options.
 *
 * @const {Config} config
 */
const config: Config = defineBuildConfig({
  entries: [
    { ignore: ['cli.ts'] },
    {
      bundle: true,
      keepNames: true,
      minify: true,
      platform: 'node',
      source: 'src/cli.ts'
    }
  ],
  sourcemap: true,
  sourcesContent: false,
  target: 'node' + pkg.engines.node.replace(/^\D+/, ''),
  tsconfig: 'tsconfig.build.json'
})

export default config
