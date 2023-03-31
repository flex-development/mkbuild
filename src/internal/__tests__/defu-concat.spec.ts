/**
 * @file Unit Tests - defuConcat
 * @module mkbuild/internal/tests/unit/defuConcat
 */

import type { Config } from '#src/interfaces'
import fs from '#src/utils/fs'
import testSubject from '../defu-concat'

describe('unit:internal/defuConcat', () => {
  it('should return object with defaults assigned', () => {
    // Arrange
    const object: Config = {
      ignore: ['src/cli.ts'],
      pattern: '*.ts',
      source: '.',
      sourcemap: true,
      sourcesContent: false,
      target: ['node14.21.2'],
      tsconfig: 'tsconfig.build.json'
    }
    const defaults: Config = {
      bundle: false,
      clean: true,
      cwd: '.',
      entries: [],
      ext: '.mjs',
      format: 'esm',
      fs,
      ignore: new Set<string>([
        '**/.DS_*',
        '**/__mocks__',
        '**/__snapshots__',
        '**/__tests__'
      ]),
      outdir: 'dist',
      pattern: '**',
      source: 'src',
      target: ['esnext']
    }

    // Act + Expect
    expect(testSubject(object, defaults)).toMatchSnapshot()
  })
})
