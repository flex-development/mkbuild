/**
 * @file Build Config
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
    { bundle: true, minify: true, source: 'src/cli.ts' }
  ],
  platform: 'node',
  sourcemap: true,
  sourcesContent: false,
  target: 'node' + pkg.engines.node.replace(/^\D+/, ''),
  treeShaking: true,
  tsconfig: 'tsconfig.build.json'
})

export default config
