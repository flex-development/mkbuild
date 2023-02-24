/**
 * @file Integration Tests - loadBuildConfig
 * @module mkbuild/config/tests/integration/loadBuildConfig
 */

import pathe from '@flex-development/pathe'
import testSubject from '../load'

describe('integration:config/loadBuildConfig', () => {
  describe('cosmiconfig', () => {
    it('should load config from .cjs file', async () => {
      // Arrange
      const location: string = pathe.resolve('__fixtures__/pkg/find-uniq')

      // Act + Expect
      expect(await testSubject(location)).toMatchSnapshot()
    })

    it('should load config from .cts file', async () => {
      // Arrange
      const location: string = pathe.resolve('__fixtures__/pkg/my-atoi')

      // Act + Expect
      expect(await testSubject(location)).toMatchSnapshot()
    })

    it('should load config from .js file', async () => {
      // Arrange
      const location: string = pathe.resolve('__fixtures__/pkg/buddy')

      // Act + Expect
      expect(await testSubject(location)).toMatchSnapshot()
    })

    it('should load config from .json file', async () => {
      // Arrange
      const location: string = pathe.resolve('__fixtures__/pkg/tribonacci')

      // Act + Expect
      expect(await testSubject(location)).toMatchSnapshot()
    })

    it('should load config from .mjs file', async () => {
      // Arrange
      const dir: string = '__fixtures__/pkg/sum-of-intervals'
      const location: string = pathe.resolve(dir)

      // Act + Expect
      expect(await testSubject(location)).toMatchSnapshot()
    })

    it('should load config from .mts file', async () => {
      // Arrange
      const location: string = pathe.resolve('__fixtures__/pkg/reverse')

      // Act + Expect
      expect(await testSubject(location)).toMatchSnapshot()
    })

    it('should load config from .ts file', async () => {
      // Arrange
      const location: string = pathe.resolve('__fixtures__/pkg/dbl-linear')

      // Act + Expect
      expect(await testSubject(location)).toMatchSnapshot()
    })
  })
})
