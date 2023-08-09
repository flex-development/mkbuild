/**
 * @file Configuration - Build
 * @module config/build
 */

import { defineBuildConfig, type Config } from '#src'
import pathe from '@flex-development/pathe'
import pkg from './package.json' assert { type: 'json' }
import tsconfig from './tsconfig.build.json' assert { type: 'json' }

/**
 * Build configuration options.
 *
 * @const {Config} config
 */
const config: Config = defineBuildConfig({
  charset: 'utf8',
  entries: [
    { dts: 'only', ignore: ['cli/**'] },
    {
      dts: false,
      pattern: [
        '!plugins/**/options.ts',
        '*.ts',
        'config/**',
        'internal/**',
        'plugins/**',
        'utils/**'
      ],
      sourcemap: true
    },
    {
      bundle: true,
      external: [
        '@nestjs/microservices',
        '@nestjs/platform-express',
        '@nestjs/websockets/socket-module',
        'cache-manager',
        'class-transformer',
        'node-fetch',
        'rxjs'
      ],
      keepNames: true,
      minify: true,
      name: 'cli',
      platform: 'node',
      source: 'src/cli/index.ts',
      sourcemap: true,
      sourcesContent: false
    }
  ],
  minifySyntax: true,
  sourceRoot: 'file' + pathe.delimiter + pathe.sep.repeat(2),
  target: [
    pkg.engines.node.replace(/^\D+/, 'node'),
    tsconfig.compilerOptions.target
  ],
  tsconfig: 'tsconfig.build.json'
})

export default config
