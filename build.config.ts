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
    { format: 'esm', ignore: ['cli.ts'] },
    {
      bundle: true,
      declaration: false,
      format: 'esm',
      minify: true,
      source: 'src/cli.ts'
    }
  ],
  esbuild: {
    sourcemap: 'external',
    sourcesContent: false,
    treeShaking: true,
    tsconfig: 'tsconfig.build.json'
  }
})

export default config
