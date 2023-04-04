/**
 * @file Unit Tests - defu
 * @module mkbuild/internal/tests/unit/defu
 */

import type { Config } from '#src/interfaces'
import fs from '#src/utils/fs'
import testSubject from '../defu'

describe('unit:internal/defu', () => {
  it('should return object with defaults assigned', () => {
    // Arrange
    const object: Config = {
      entries: [
        { ignore: ['cli.ts'] },
        { bundle: true, minify: true, platform: 'node', source: 'src/cli.ts' }
      ],
      source: '.',
      sourcemap: true,
      sourcesContent: false,
      target: 'node16.20.0',
      tsconfig: 'tsconfig.build.json'
    }
    const defaults: Config = {
      cwd: '.',
      entries: [],
      fs,
      outdir: 'dist',
      sourcemap: false,
      watch: false,
      write: false
    }

    // Act + Expect
    expect(testSubject(object, defaults)).toMatchSnapshot()
  })
})
