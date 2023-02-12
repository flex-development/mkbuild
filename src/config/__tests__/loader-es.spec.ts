/**
 * @file Unit Tests - esLoader
 * @module mkbuild/config/tests/unit/esLoader
 */

import pathe from '@flex-development/pathe'
import fs from 'node:fs/promises'
import testSubject from '../loader-es'

describe('unit:config/esLoader', () => {
  it('should return config from .cts file', async () => {
    // Arrange
    const file: string = '__fixtures__/pkg/my-atoi/build.config.cts'
    const path: string = pathe.resolve(file)

    // Act
    const result = await testSubject(path, await fs.readFile(path, 'utf8'))

    // Expect
    expect(result).toMatchSnapshot()
  })

  it('should return config from .js file', async () => {
    // Arrange
    const file: string = '__fixtures__/pkg/buddy/build.config.js'
    const path: string = pathe.resolve(file)

    // Act
    const result = await testSubject(path, await fs.readFile(path, 'utf8'))

    // Expect
    expect(result).toMatchSnapshot()
  })

  it('should return config from .mjs file', async () => {
    // Arrange
    const file: string = '__fixtures__/pkg/sum-of-intervals/build.config.mjs'
    const path: string = pathe.resolve(file)

    // Act
    const result = await testSubject(path, await fs.readFile(path, 'utf8'))

    // Expect
    expect(result).toMatchSnapshot()
  })

  it('should return config from .mts file', async () => {
    // Arrange
    const file: string = '__fixtures__/pkg/reverse/build.config.mts'
    const path: string = pathe.resolve(file)

    // Act
    const result = await testSubject(path, await fs.readFile(path, 'utf8'))

    // Expect
    expect(result).toMatchSnapshot()
  })

  it('should return config from .ts file', async () => {
    // Arrange
    const file: string = '__fixtures__/pkg/dbl-linear/build.config.ts'
    const path: string = pathe.resolve(file)

    // Act
    const result = await testSubject(path, await fs.readFile(path, 'utf8'))

    // Expect
    expect(result).toMatchSnapshot()
  })
})
