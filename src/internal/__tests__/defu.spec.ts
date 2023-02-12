/**
 * @file Unit Tests - defu
 * @module mkbuild/internal/tests/unit/defu
 */

import type { Config } from '#src/interfaces'
import fs from '#src/utils/fs'
import ignore from '#src/utils/ignore-patterns'
import testSubject from '../defu'

describe('unit:internal/defu', () => {
  it('should return object with defaults assigned', () => {
    // Arrange
    const object: Config = {
      entries: [
        { ignore: ['cli.ts'] },
        { bundle: true, minify: true, platform: 'node', source: 'src/cli.ts' }
      ],
      sourcemap: true,
      sourcesContent: false,
      target: 'node14.21.2',
      tsconfig: 'tsconfig.build.json'
    }
    const defaults: Config = {
      bundle: false,
      clean: true,
      cwd: '.',
      dts: true,
      entries: [],
      ext: '.mjs',
      format: 'esm',
      fs,
      ignore,
      outdir: 'dist',
      pattern: '**',
      source: 'src'
    }

    // Act + Expect
    expect(testSubject(object, defaults)).toMatchSnapshot()
  })
})
