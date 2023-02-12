/**
 * @file Integration Tests - loadBuildConfig
 * @module mkbuild/config/tests/integration/loadBuildConfig
 */

import pathe from '@flex-development/pathe'
import testSubject from '../load'

describe('integration:config/loadBuildConfig', () => {
  describe('cosmiconfig', () => {
    it('should return config from .cjs file', async () => {
      // Arrange
      const dir: string = '__fixtures__/pkg/find-uniq'
      const location: string = pathe.resolve(dir)

      // Act + Expect
      expect(await testSubject(location)).toMatchSnapshot()
    })

    it('should return config from .cts file', async () => {
      // Arrange
      const dir: string = '__fixtures__/pkg/my-atoi'
      const location: string = pathe.resolve(dir)

      // Act + Expect
      expect(await testSubject(location)).toMatchSnapshot()
    })

    it('should return config from .js file', async () => {
      // Arrange
      const dir: string = '__fixtures__/pkg/buddy'
      const location: string = pathe.resolve(dir)

      // Act + Expect
      expect(await testSubject(location)).toMatchSnapshot()
    })

    it('should return config from .json file', async () => {
      // Arrange
      const dir: string = '__fixtures__/pkg/tribonacci'
      const location: string = pathe.resolve(dir)

      // Act + Expect
      expect(await testSubject(location)).toMatchSnapshot()
    })

    it('should return config from .mjs file', async () => {
      // Arrange
      const dir: string = '__fixtures__/pkg/sum-of-intervals'
      const location: string = pathe.resolve(dir)

      // Act + Expect
      expect(await testSubject(location)).toMatchSnapshot()
    })

    it('should return config from .mts file', async () => {
      // Arrange
      const dir: string = '__fixtures__/pkg/reverse'
      const location: string = pathe.resolve(dir)

      // Act + Expect
      expect(await testSubject(location)).toMatchSnapshot()
    })

    it('should return config from .ts file', async () => {
      // Arrange
      const dir: string = '__fixtures__/pkg/dbl-linear'
      const location: string = pathe.resolve(dir)

      // Act + Expect
      expect(await testSubject(location)).toMatchSnapshot()
    })
  })
})
