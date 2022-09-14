/**
 * @file Unit Tests - esLoader
 * @module mkbuild/config/tests/unit/esLoader
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import testSubject from '../loader-es'

describe('unit:config/esLoader', () => {
  const cases: string[] = ['cts', 'js', 'mjs', 'mts', 'ts']

  cases.forEach(ext => {
    it(`should return config from .${ext} file`, async () => {
      // Arrange
      const filename: string = `__fixtures__/configs/${ext}/build.config.${ext}`
      const file: string = path.resolve(filename)

      // Act
      const result = await testSubject(file, await fs.readFile(file, 'utf8'))

      // Expect
      expect(result).toMatchSnapshot()
    })
  })
})
