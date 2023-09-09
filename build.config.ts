/**
 * @file Configuration - Build
 * @module config/build
 */

import { defineBuildConfig, type Config } from '#src'
import pathe from '@flex-development/pathe'
import { at } from '@flex-development/tutils'
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
      alias: {
        '@flex-development/errnode': '@flex-development/errnode',
        '@flex-development/mlly': '@flex-development/mlly',
        '@flex-development/pathe': '@flex-development/pathe',
        '@flex-development/tutils': '@flex-development/tutils',
        dequal: 'dequal',
        iterare: 'iterare',
        lodash: 'lodash-es',
        tslib: 'tslib',
        uid: 'uid'
      },
      bundle: true,
      external: [
        '@babel/*',
        '@nestjs/microservices',
        '@nestjs/platform-express',
        '@nestjs/websockets/socket-module',
        'cache-manager',
        'class-transformer',
        'class-validator',
        'node-fetch'
      ],
      minify: true,
      name: 'cli',
      platform: 'node',
      source: 'src/cli/index.ts',
      sourcemap: true,
      sourcesContent: false
    }
  ],
  keepNames: true,
  minifySyntax: true,
  sourceRoot: 'file' + pathe.delimiter + pathe.sep.repeat(2),
  target: [
    'node' + at(/([\d.]+)/.exec(pkg.engines.node), 0, ''),
    tsconfig.compilerOptions.target
  ],
  tsconfig: 'tsconfig.build.json'
})

export default config
