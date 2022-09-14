/**
 * @file Integration Tests - loadBuildConfig
 * @module mkbuild/config/tests/integration/loadBuildConfig
 */

import path from 'node:path'
import testSubject from '../load'

describe('integration:config/loadBuildConfig', () => {
  describe('cosmiconfig', () => {
    const cases: string[] = ['cjs', 'cts', 'js', 'json', 'mjs', 'mts', 'ts']

    cases.forEach(extension => {
      it(`should load config from build.config.${extension}`, async () => {
        // Arrange
        const location = path.resolve(`__fixtures__/configs/${extension}`)

        // Act + Expect
        expect(await testSubject(location)).toMatchSnapshot()
      })
    })
  })
})
