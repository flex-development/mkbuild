/**
 * @file Fixtures - relative-specifiers
 * @module fixtures/relative-specifiers.cts
 */

require('esbuild')
require('node:util')
require('pathe')
require('tsconfig-paths')
require('tsconfig-paths/lib/tsconfig-loader')
require('../src/config/constants.ts')
require('../src/utils/extract-statements')
require('/tmp')
